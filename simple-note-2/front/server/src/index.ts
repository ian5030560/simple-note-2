import express from "express";
import 'ignore-styles'
import cors from "cors";
import Socket from "./socket";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(cookieParser());

const PORT = 3000;

const socket = new Socket(app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
}));

app.get("/room", (req, res) => {
  const room = req.query.id;
  if (typeof room !== "string") return res.sendStatus(400);

  const query = socket.query(room);
  const data = { count: 0 };

  if (!query) return res.send(data);
  const user = req.cookies["username"];

  data.count = data.count - (query.has(user) ? 1 : 0);
  return res.send(data);
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});