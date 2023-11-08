import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import Express from "express";

const tasksRouter = Express.Router();

tasksRouter.get("/", async (req: Request, res: Response) => {
    try {
        const tasks = await TaskService.getTasks();
        res.json(tasks);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Task not found";
        return res.status(404).json({ message: errorMessage });
    }
});

tasksRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const task = await TaskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Task not found";
        return res.status(404).json({ message: errorMessage });
    }
});

tasksRouter.post("/", async (req: Request, res: Response) => {
    try {
        const requiredFields = ["accountId", "scheduleId", "startTime", "duration", "type"];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // Check if type is enumerated to 'break' or 'work'
        if (!['break', 'work'].includes(req.body.type)) {
            return res.status(400).json({ message: 'Type can either be \'work\' or \'break\'' });
        }

        const task = await TaskService.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Task not found";
        return res.status(404).json({ message: errorMessage });
    }
});

tasksRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        console.log("rew ", req.body)
        // Check if type is enumerated to 'break' or 'work'
        if (!['break', 'work'].includes(req.body.type)) {
            return res.status(400).json({ message: 'Type can either be \'work\' or \'break\'' });
        }

        const task = await TaskService.updateTask(req.params.id, req.body);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Task not found";
        return res.status(404).json({ message: errorMessage });
    }
});

tasksRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        await TaskService.deleteTask(req.params.id);
        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Task not found";
        return res.status(404).json({ message: errorMessage });
    }
});

export default tasksRouter;
