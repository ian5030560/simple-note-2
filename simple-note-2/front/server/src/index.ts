import express from "express";
import 'ignore-styles'
import cors from "cors";
import Socket from "./socket";


const app = express();
app.use(cors());

app.get("/", (_, res) => {
  res.send('Hello World');
});

const socket = new Socket();

app.post("/room/number", express.json(), (req, res) => {
  const room = req.body.room;
  if(typeof room !== "string") return res.sendStatus(400);
  
  const query = socket.query(room);
  return res.send({count: query ? query.size : 0});
});

const PORT = 4000;

socket.start(app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
}))