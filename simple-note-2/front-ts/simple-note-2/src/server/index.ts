import WebSocket from "ws";
import http, { IncomingMessage, request } from 'http';
import { parseInt } from 'lib0/number';
import * as Y from "yjs";
import headlessConvertYDocStateToLexicalJSON from "./createHeadlessCollaborativeEditor";
import { register } from "node-css-require";
register();
// eslint-disable-next-line import/first
import loader from "../Editor/loader";


const { setupWSConnection, getYDoc } = require("y-websocket/bin/utils");

const host: string = process.env.HOST || 'localhost';
const port: number = parseInt(process.env.PORT || '1234');

const server: http.Server = http.createServer((_request: IncomingMessage, response: http.ServerResponse) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');

});

const wss = new WebSocket.Server({ noServer: true });

const Loader = loader();
wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req);
  let docName = (req.url || '').slice(1).split('?')[0];
  let ydoc: Y.Doc = getYDoc(docName, true);
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
      if(ok) return;
      
    })
    .catch(e => {

    })
  })
});

server.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`);
});