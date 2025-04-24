import express from "express";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.router.js";
import { productRouter } from "./routers/product.router.js";
import { documentRouter } from "./routers/document.router.js";
import { reminderRouter } from "./routers/reminder.router.js";
import { scraperRouter } from "./routers/scraper.router.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true // If using authentication like JWT or cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(userRouter);
app.use(productRouter);
app.use(documentRouter);
app.use(reminderRouter);
app.use(scraperRouter);


app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);
});

export default app;
