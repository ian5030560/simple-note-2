import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useWrapper } from "../Draggable/component";
import { useRef } from "react";
import { useCollab } from "./store";

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

function providerFactory(id: string, yjsMap: Map<string, Doc>): Provider {
    const doc = getDocFromMap(id, yjsMap);
    const provider = new WebsocketProvider("ws://localhost:4000", id, doc, {connect: false})

    // @ts-expect-error TODO: FIXME
    return provider;
}

export default function CollaboratePlugin() {
    
    const wrapper = useWrapper();
    const ref = useRef(wrapper);
    const {activate, room} = useCollab();
    
    return activate && room ? <CollaborationPlugin
        id={room} shouldBootstrap={true}
        providerFactory={providerFactory}
        cursorsContainerRef={ref}
    /> : null;
};