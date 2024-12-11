import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useCallback } from "react";
import { CursorsContainerRef } from "@lexical/react/shared/useYjsCollaboration";
import { InitialEditorStateType } from "@lexical/react/LexicalComposer";

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
    initialEditorState?: InitialEditorStateType;
    cursorsContainerRef: CursorsContainerRef;
    username?: string;
}
export default function CollaboratePlugin(props: CollabotatePluginProps) {

    // const provider = useRef<WebsocketProvider | null>(null);

    const providerFactory = useCallback((id: string, yjsMap: Map<string, Doc>) => {
        // const { current } = provider;
        // if (current) {
        //     if (current.roomname === id) return provider.current as unknown as Provider;
        //     current.disconnect();
        //     current.destroy();
        // }

        const doc = getDocFromMap(id, yjsMap);
        const p = new WebsocketProvider(COLLAB, id, doc, { connect: false });
        // provider.current = p;

        return p as unknown as Provider;
    }, []);

    return <CollaborationPlugin
        id={props.room} shouldBootstrap={true}
        providerFactory={providerFactory}
        cursorsContainerRef={props.cursorsContainerRef}
        username={props.username}
        initialEditorState={props.initialEditorState} />;
};