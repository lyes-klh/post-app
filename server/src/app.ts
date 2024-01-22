import express from "express";
import postsRouter from "./routers/postsRouter";

const app = express();

app.use(express.json());

app.use("/api/posts", postsRouter);

export default app;
