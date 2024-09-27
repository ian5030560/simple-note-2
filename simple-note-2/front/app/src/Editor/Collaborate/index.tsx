import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useAnchor } from "../Draggable/component";
import { useCallback, useRef } from "react";
import { useCookies } from "react-cookie";

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

export default function CollaboratePlugin({ room }: { room: string }) {

    const anchor = useAnchor();
    const ref = useRef(anchor);
    const [{ username }] = useCookies(["username"]);
    // const provider = useRef<WebsocketProvider | null>(null);

    const providerFactory = useCallback((_id: string, yjsMap: Map<string, Doc>) => {
        // if (provider.current) {
        //     provider.current.disconnect();
        //     provider.current.destroy();
        // }

        const doc = getDocFromMap(_id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", _id, doc, { connect: true })
        // provider.current = p;

        return p as unknown as Provider;
    }, []);

    return <CollaborationPlugin
        id={room} shouldBootstrap={false}
        providerFactory={providerFactory}
        cursorsContainerRef={ref}
        username={username} />;
};