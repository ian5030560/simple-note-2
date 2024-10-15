import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useCallback, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { $empty, InitialNoteType } from "../plugins/savePlugin";
import { CursorsContainerRef } from "@lexical/react/shared/useYjsCollaboration";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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

    useEffect(() => {
        editor.setEditable(false);
        const initial = props.initialNote;
        provider.current?.connect();
        
        if (initial !== undefined) {
            if (typeof initial === "function") {
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                editor.update(() => initial(editor), {tag: "history-merge"});
            }
            else if(typeof initial === "string") {
                const editorState = editor.parseEditorState(JSON.parse(initial));
                editor.setEditorState(editorState, {tag: "history-merge"});
            }
            else{
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                editor.update($empty, {tag: "history-merge"});
            }
        }
        editor.setEditable(true);

    }, [editor, props.initialNote]);

    const providerFactory = useCallback((id: string, yjsMap: Map<string, Doc>) => {
        const { current } = provider;
        if (current) {
            if(current.roomname === id) return provider.current as unknown as Provider;
            current.disconnect();
            current.destroy();
        }
        
        const doc = getDocFromMap(id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", id, doc, { connect: false });
        provider.current = p;

        return p as unknown as Provider;
    }, []);

    return <CollaborationPlugin
        id={props.room} shouldBootstrap={false}
        providerFactory={providerFactory}
        cursorsContainerRef={props.cursorsContainerRef}
        username={username} />;
};