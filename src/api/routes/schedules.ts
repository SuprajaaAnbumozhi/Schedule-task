// src/api/routes/schedules.ts

import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import Express from "express";

const schedulesRouter = Express.Router();

schedulesRouter.get("/", async (req: Request, res: Response) => {
  const schedules = await ScheduleService.getSchedules();
  res.json(schedules);
});

schedulesRouter.get("/:id", async (req: Request, res: Response) => {
    try {
      const schedule = await ScheduleService.getScheduleById(req.params.id);
      res.json(schedule);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Schedule not found";
      return res.status(404).json({ message: errorMessage });
    }
});
  
schedulesRouter.post("/", async (req: Request, res: Response) => {
    const requiredFields = ["accountId", "agentId", "startTime", "endTime"];
  
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
  
    const schedule = await ScheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
});

schedulesRouter.put("/:id", async (req: Request, res: Response) => {
    try {
      const schedule = await ScheduleService.updateSchedule(req.params.id, req.body);
      res.json(schedule);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Schedule not found";
      return res.status(404).json({ message: errorMessage });
    }
});

schedulesRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
      await ScheduleService.deleteSchedule(req.params.id);
      res.status(204).send();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Schedule not found";
      return res.status(404).json({ message: errorMessage });
    }
});

export default schedulesRouter;
