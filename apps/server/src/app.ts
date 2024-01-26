import express from "express";
import postsRouter from "./routes/postsRouter";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(helmet());
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/posts", postsRouter);

export default app;
