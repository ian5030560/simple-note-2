import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useCallback, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { InitialNoteType } from "../Save";
import { CursorsContainerRef } from "@lexical/react/shared/useYjsCollaboration";
import { $createParagraphNode, $createTextNode, $getRoot, CLEAR_EDITOR_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useAPI, { APIs } from "../../util/api";

function getDocFromMap(id: string, yjsDocMap: Map<string, Doc>): Doc {
    let doc = yjsDocMap.get(id);

    if (doc === undefined) {
        doc = new Doc();
        yjsDocMap.set(id, doc);
    } else {
        doc.load();
    }

    return doc;
}

interface CollabotatePluginProps {
    room: string;
    initialNote?: InitialNoteType;
    cursorsContainerRef: CursorsContainerRef;
}
export default function CollaboratePlugin(props: CollabotatePluginProps) {

    const [{ username }] = useCookies(["username"]);
    const provider = useRef<WebsocketProvider | null>(null);
    const [editor] = useLexicalComposerContext();
    const getNumber = useAPI(APIs.getNumberInRoom);

    const providerFactory = useCallback((id: string, yjsMap: Map<string, Doc>) => {
        if (provider.current?.roomname === id) {
            return provider.current as unknown as Provider;
        }
        editor.setEditable(false);
        const doc = getDocFromMap(id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", id, doc, { connect: false });
        provider.current = p;

        getNumber({ room: id })[0]
            .then(res => {
                if (!res.ok) return;
                return res.json();
            })
            .then((data?: {count: number}) => {
                if (!data) return;
                const { count } = data;
                if(count === 0){
                    const { initialNote } = props;
                    if (initialNote) {
                        if (typeof initialNote === "function") {
                            editor.update(() => initialNote(editor));
                        }
                        else {
                            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                            const editorState = editor.parseEditorState(initialNote);
                            editor.setEditorState(editorState);
                        }
                    }
                    provider.current?.connect();
                    editor.setEditable(true);
                }
            })
        return p as unknown as Provider;
    }, [editor, getNumber, props]);

    return <CollaborationPlugin
        id={props.room} shouldBootstrap={false}
        providerFactory={providerFactory}
        cursorsContainerRef={props.cursorsContainerRef}
        username={username} />;
};