// server.ts

import express from "express";
import apiRouter from "./api";

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
