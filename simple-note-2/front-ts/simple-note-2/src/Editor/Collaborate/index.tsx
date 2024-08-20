import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useWrapper } from "../Draggable/component";
import { useCallback, useRef } from "react";
import { useCollab } from "./store";
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

export default function CollaboratePlugin() {

    const wrapper = useWrapper();
    const ref = useRef(wrapper);
    const { activate, room } = useCollab();
    const [{ username }] = useCookies(["username"]);
    const provider = useRef<WebsocketProvider | null>(null);

    const providerFactory = useCallback((id: string, yjsMap: Map<string, Doc>) => {
        if(provider.current){
            provider.current.disconnect();
            provider.current.destroy();
        }
        
        const doc = getDocFromMap(id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", id, doc, { connect: false })
        provider.current = p;
 
        return p as unknown as Provider;
    }, []);

    return activate && room ? <CollaborationPlugin
        id={room} shouldBootstrap={true}
        providerFactory={providerFactory}
        cursorsContainerRef={ref}
        username={username}
    /> : null;
};