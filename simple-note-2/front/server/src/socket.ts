import loader from "../../app/src/Editor/loader";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import WebSocket from "ws";
import cookie from "cookie";
import { Server } from "http";
import * as Y from "yjs";

const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");

const rooms = new Map<string, Set<string>>();

const Loader = loader();

export default function socket(server: Server) {
    const wss = new WebSocket.Server({server});

    wss.on("connection", (conn, req) => {
        const rawCookie = req.headers.cookie;
        if (!rawCookie) return conn.close(3000);
        let docName = (req.url || '').slice(1).split('?')[0];
        const user = cookie.parse(rawCookie)["username"];

        if (!user) return conn.close(3000);

        if (!rooms.has(docName)) {
            rooms.set(docName, new Set());
        }

        rooms.set(docName, rooms.get(docName)!.add(user));

        setupWSConnection(conn, req);

        let ydoc: Y.Doc = getYDoc(docName, true);
        ydoc.on("update", () => {
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

        conn.on("close", () => {
            const users = rooms.get(docName);
            if (!users) return;

            users.delete(user);
            if (users.size === 0) {
                rooms.delete(docName);
            }
            else {
                rooms.set(docName, users);
            }
        });
    });
}


export function people(room: string) {
    return rooms.get(room);
}