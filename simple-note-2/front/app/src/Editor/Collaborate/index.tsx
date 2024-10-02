import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useCallback, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { $empty, InitialNoteType } from "../Save";
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
        const { current } = provider;
        if (current) {
            if(current.roomname === id) return provider.current as unknown as Provider;
            current.disconnect();
            current.destroy();
        }
        
        editor.setEditable(false);
        const doc = getDocFromMap(id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", id, doc, { connect: false });
        provider.current = p;

        getNumber({ room: id })[0]
            .then(res => res.ok ? res.json() : undefined)
            .then((data?: { count: number }) => {
                if (!data) return;
                const { count } = data;
                const { initialNote } = props;
                if (count === 0 && initialNote !== undefined) {
                    if (typeof initialNote === "function") {
                        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                        editor.update(() => initialNote(editor));
                    }
                    else if(typeof initialNote === "string") {
                        const editorState = editor.parseEditorState(initialNote);
                        editor.setEditorState(editorState);
                    }
                    else{
                        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                        editor.update($empty);
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