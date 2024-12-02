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
    private wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>;

    constructor(server: Server){
        this.wss = new WebSocket.Server({ server });
        this.wss.on("connection", (ws, req) => {
            const docName = (req.url || '').slice(1).split('?')[0];
            console.log(docName);

            // this.aiMode(ws, req);
            this.testMode(ws, req);
            // this.normalMode(ws, req);
        });
    }

    private testMode(ws: WebSocket, req: IncomingMessage) {
        const docName = (req.url || '').slice(1).split('?')[0];
        if (docName !== "playground/collab") return;

        const user = randomUUID();
        setupWSConnection(ws, req);
        let room = this.query(docName);
        if (!room) {
            room = new Set();
            this.rooms.set(docName, room);
        }
        room.add(user);
    }

    private normalMode(ws: WebSocket, req: IncomingMessage) {
        const docName = (req.url || '').slice(1).split('?')[0];
        const rawCookie = req.headers.cookie;
        if (!rawCookie) return ws.close(3000);

        const user = cookie.parse(rawCookie)["username"];
        console.log(`${user} connected`);

        const ydoc: Y.Doc = getYDoc(docName, true);
        setupWSConnection(ws, req);
        ydoc.on("update", () => {
            // @ts-ignore
            const lexicalJSON = headlessConvertYDocStateToLexicalJSON(nodes, Y.encodeStateAsUpdate(ydoc));
            const content = JSON.stringify(lexicalJSON);
            console.log(`${user} sending:\n${content}`);

            const [id, master] = docName.split("/");

            fetch("http://127.0.0.1:8000/saveNote/", {
                body: JSON.stringify({ username: atob(master), noteId: id, content: content }), method: "POST",
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    "content-type": "application/json",
                }
            })
                .then(res => {
                    console.log(`${user} sent successfully`);
                })
                .catch(e => {
                    console.log(`${user} occur ${e}`);
                })
        });

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

            console.log(`${user} disconnected`);
        });
    }

    private aiMode(ws: WebSocket, req: IncomingMessage) {
        const docName = (req.url || '').slice(1).split('?')[0];
        if (docName !== "ws/ai/") return;
        ws.on("message", () => {
            setTimeout(() => ws.send(JSON.stringify({ result: randomUUID().split("-").join("") })), 3000);
        });
        ws.on("close", () => {
            console.log("disconnect");
        });
    }

    query(room: string) {
        return this.rooms.get(room);
    }
}