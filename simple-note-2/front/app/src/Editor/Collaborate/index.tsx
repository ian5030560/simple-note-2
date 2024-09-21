import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { useAnchor } from "../Draggable/component";
import { useCallback, useRef } from "react";
import { useCookies } from "react-cookie";
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

export default function CollaboratePlugin() {

    const anchor = useAnchor();
    const ref = useRef(anchor);
    const { room } = useCollab();
    const [{ username }] = useCookies(["username"]);
    const provider = useRef<WebsocketProvider | null>(null);

    const providerFactory = useCallback((_id: string, yjsMap: Map<string, Doc>) => {
        if (provider.current) {
            provider.current.disconnect();
            provider.current.destroy();
        }

        const doc = getDocFromMap(_id, yjsMap);
        const p = new WebsocketProvider("ws://localhost:4000", _id, doc, { connect: false })
        provider.current = p;

        return p as unknown as Provider;
    }, []);

    return <>
        {
            room && <CollaborationPlugin
                id={room} shouldBootstrap={false}
                providerFactory={providerFactory}
                cursorsContainerRef={ref}
                username={username} />
        }
        {/* {
            anchor && !ediitable && <Modal title={null} styles={{ body: { textAlign: "center" } }}
                footer={<Button type="primary" onClick={handleClick}>前往協作</Button>} closable={false}>
                <Typography.Text>此筆記已設為協作模式，點擊下方按鈕進行協作</Typography.Text>
            </Modal>
        } */}
    </>;
};