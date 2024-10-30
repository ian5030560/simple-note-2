import express from "express";
import 'ignore-styles'
import cors from "cors";
import Socket from "./socket";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());

app.get("/", (_, res) => {
  res.send('Hello World');
});

const PORT = 4000;

const socket = new Socket(app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
}));

app.use(cookieParser());

app.post("/room/number", express.json(), (req, res) => {
  const room = req.body.room;
  if (typeof room !== "string") return res.sendStatus(400);

  const query = socket.query(room);
  const data = { count: 0 };

  if (!query) return res.send(data);
  const user = req.cookies["username"];

  data.count = data.count - (query.has(user) ? 1 : 0);
  return res.send(data);
});