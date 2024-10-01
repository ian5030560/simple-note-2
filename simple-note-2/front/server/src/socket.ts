import loader from "../../app/src/Editor/loader";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import WebSocket from "ws";
import cookie from "cookie";
import { IncomingMessage, Server } from "http";
import * as Y from "yjs";
import { randomUUID } from "crypto";

const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");

const Loader = loader();

export default class Socket {

    private rooms = new Map<string, Set<string>>();
    private wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage> | null = null;
    private test: string = "test";

    query(room: string) {
        return this.rooms.get(room);
    }

    start(server: Server) {
        this.wss = new WebSocket.Server({ server });
        this.wss.on("connection", (ws, req) => {
            const docName = (req.url || '').slice(1).split('?')[0];
            console.log(docName);
            
            let user: string;
            if(docName === this.test){
                user = randomUUID();
            }
            else{
                const rawCookie = req.headers.cookie;
                if (!rawCookie) return ws.close(3000);
                user = cookie.parse(rawCookie)["username"];
            }

            setupWSConnection(ws, req);
            if(!this.query(docName)) this.rooms.set(docName, new Set());
            this.query(docName)?.add(user);

            if(docName !== this.test){
                let ydoc: Y.Doc = getYDoc(docName, true);
                ydoc.on("update", () => {
                    // @ts-ignore
                    const lexicalJSON = headlessConvertYDocStateToLexicalJSON(Loader.nodes, Y.encodeStateAsUpdate(ydoc));
                    console.log(JSON.stringify(lexicalJSON));
                    // fetch("http://localhost:8000/saveNote/", {
                    //   body: JSON.stringify(lexicalJSON), method: "POST",
                    //   headers: {
                    //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    //     "content-type": "application/json",
                    //   }
                    // })
                    //   .then(res => res.ok)
                    //   .then(ok => {
                    //     if (ok) return;

                    //   })
                    //   .catch(e => {

                    //   })
                });
            }

            ws.on("close", () => {
                const users = this.query(docName);
                if (!users) return;

                users.delete(user);
                if (users.size === 0) {
                    this.rooms.delete(docName);
                }
                else {
                    this.rooms.set(docName, users);
                }
            });

            // ws.send(JSON.stringify({count: this.query(docName)!.size}));
            ws.emit("count", {count: 1});
        })
    }
}