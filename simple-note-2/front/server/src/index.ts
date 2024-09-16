import express from "express";
import 'ignore-styles'
import { randomUUID } from "crypto";
import cors from "cors";
import socket, { people } from "./socket";


const app = express();
app.use(cors());

app.get("/", (_, res) => {
  res.send('Hello World');
});

app.post("/qrcode", express.json(), (req, res) => {
  const user: string = req.body.username;
  res.send(randomUUID());
});


app.post("/people", express.json(), (req, res) => {
  const room = req.body.room;
  if(typeof room !== "string") return res.sendStatus(400);
  
  const users = people(room);
  if(!users) return res.sendStatus(404);
  
  return res.send({count: users.size});
});

const PORT = 4000;

socket(app.listen(PORT, () => {
  console.log(`listening to ${PORT}`)
}))