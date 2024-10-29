import nodes from "../../app/src/Editor/nodes";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import WebSocket from "ws";
import cookie from "cookie";
import { IncomingMessage, Server } from "http";
import * as Y from "yjs";
import { randomUUID } from "crypto";

const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");

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
            if(docName === "ws/ai/"){
                ws.on("message", () => {
                    setTimeout(() => ws.send(JSON.stringify({result: randomUUID().split("-").join("")})), 3000);
                });
                ws.on("close", () => {
                    console.log("disconnect");
                });
                return;
            }

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
            let room = this.query(docName);
            if(!room){
                room = new Set();
                this.rooms.set(docName, room);
            }
            room.add(user);

            if(docName !== this.test){
                let ydoc: Y.Doc = getYDoc(docName, true);
                
                ydoc.on("update", () => {
                    // @ts-ignore
                    const lexicalJSON = headlessConvertYDocStateToLexicalJSON(nodes, Y.encodeStateAsUpdate(ydoc));
                    const content = JSON.stringify(lexicalJSON);
                    console.log(content);
                    
                    const [id, username] = docName.split("/");
 
                    fetch("http://127.0.0.1:8000/saveNote/", {
                      body: JSON.stringify({username: atob(username), noteId: id, content: content}), method: "POST",
                      headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                        "content-type": "application/json",
                      }
                    })
                      .then(res => {
                        console.log(res.status);
                      })
                      .catch(e => {
                        console.log(e);
                      })
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
        })
    }
}