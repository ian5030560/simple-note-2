import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useWrapper } from "../Draggable/component";
import { useRef } from "react";

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
    const provider = new WebsocketProvider("", id, doc, {connect: false})

    // @ts-expect-error TODO: FIXME
    return provider;
}
export default function RealTimePlugin() {
    
    const wrapper = useWrapper();
    const ref = useRef(wrapper);

    return <CollaborationPlugin
        id="simple-note-2-real-time"
        shouldBootstrap={false}
        providerFactory={providerFactory}
        cursorsContainerRef={ref}
    />
};