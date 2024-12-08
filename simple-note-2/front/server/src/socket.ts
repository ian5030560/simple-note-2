import nodes from "../../app/src/Editor/nodes";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import WebSocket from "ws";
import cookie from "cookie";
import { IncomingMessage, Server } from "http";
import * as Y from "yjs";
import { randomUUID } from "crypto";

const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");

enum UPLOAD {
    IDLE, WAIT, READY
}
export default class Socket {

    private rooms = new Map<string, Set<string>>();
    private wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>;
    private roomStates = new Map<string, { state: UPLOAD, interval: NodeJS.Timeout }>();

    constructor(server: Server) {
        this.wss = new WebSocket.Server({ server });
        this.wss.on("connection", (ws, req) => {
            const docName = (req.url || '').slice(1).split('?')[0];
            console.log(docName);
            if (docName === "test") {
                this.testMode(ws, req);
            }
            else {
                this.normalMode(ws, req);
            }
        });
    }

    private testMode(ws: WebSocket, req: IncomingMessage) {
        const docName = (req.url || '').slice(1).split('?')[0];
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

        if (!this.roomStates.has(docName)) {
            this.roomStates.set(docName, {
                state: UPLOAD.IDLE, interval: setInterval(() => {
                    this.uploadContent(ydoc, docName, user);
                }, 120000)
            });
        }

        ydoc.on("update", () => {
            const { interval } = this.roomStates.get(docName)!;
            console.log(`${user} updating`);
            this.roomStates.set(docName, { state: UPLOAD.WAIT, interval });
            setTimeout(() => {
                console.log(`${user} ready`);
                this.roomStates.set(docName, { state: UPLOAD.READY, interval });
            }, 1000);
        });


        ws.on("close", () => {
            const users = this.query(docName);
            if (!users) return;

            this.uploadContent(ydoc, docName, user);

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

    private uploadContent(ydoc: Y.Doc, docName: string, username: string) {
        const { state, interval } = this.roomStates.get(docName)!;
        if (state === UPLOAD.READY) {
            // @ts-ignore
            const lexicalJSON = headlessConvertYDocStateToLexicalJSON(nodes, Y.encodeStateAsUpdate(ydoc));
            const content = JSON.stringify(lexicalJSON);
            console.log(`${username} sending:\n${content}`);

            const [id, master] = docName.split("/");

            fetch("http://127.0.0.1:8000/note/save/", {
                method: "POST",
                body: JSON.stringify({
                    username: Buffer.from(master, "base64").toString("base64"),
                    noteId: id, content: content
                }),
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    "content-type": "application/json",
                }
            }).then(() => {
                console.log(`${username} sent successfully`);
            }).catch(e => {
                console.log(`${username} occur ${e}`);
            }).finally(() => {
                this.roomStates.set(docName, { state: UPLOAD.IDLE, interval: interval });
            });
        }
    }
    
    query(room: string) {
        return this.rooms.get(room);
    }
}