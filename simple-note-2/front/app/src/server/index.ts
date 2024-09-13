import express from "express";
import WebSocket from "ws";
import * as Y from "yjs";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import 'ignore-styles'
import loader from "../Editor/loader";
import { randomUUID } from "crypto";

const app = express();

 
const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");
app.get("/", (_, res) => {
  res.send('Hello World');
});

// const rooms = new Map();
app.post("/qrcode", express.json(), (req, res) => {
  // const user = req.body.username as string;
  res.send(randomUUID());
});

const Loader = loader();
const PORT = 4000;
const wss = new WebSocket.Server({ server: app.listen(PORT, () => console.log(`listening to ${PORT}`)) });

wss.on("connection", (conn, req) => {
  if (req.url?.startsWith("realtime-mobile")) {
    console.log(1);
  }
  else {
    setupWSConnection(conn, req);
    const docName = (req.url || '').slice(1).split('?')[0];
    const ydoc: Y.Doc = getYDoc(docName, true);
    ydoc.on("update", () => {
      const lexicalJSON = headlessConvertYDocStateToLexicalJSON(Loader.nodes, Y.encodeStateAsUpdate(ydoc));
      fetch("http://localhost:8000/saveNote/", {
        body: JSON.stringify(lexicalJSON), method: "POST",
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "content-type": "application/json",
        }
      })
        .then(res => res.ok)
        .then(ok => {
          if (ok) return;

        })
        .catch(() => {

        })
    })
  }
});