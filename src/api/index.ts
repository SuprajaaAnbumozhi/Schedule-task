// src/api/index.ts

import { Router } from "express";
import schedulesRouter from "./routes/schedules";
import tasksRouter from "./routes/tasks";

const router = Router();

router.use("/schedules", schedulesRouter);
router.use("/tasks", tasksRouter);

export default router;
