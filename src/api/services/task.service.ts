import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class TaskService {
    static async checkIfTaskExists(id: string) {
        const existingTask = await prisma.task.findFirst({ where: { id } });
        return existingTask;
    }

    static async getTasks() {
        return await prisma.task.findMany();
    }

    static async getTaskById(id: string) {
        const existingTask = await TaskService.checkIfTaskExists(id);
        if (!existingTask) {
            throw new Error('Task not found');
        }

        return existingTask;
    }

    static async createTask(task: any) {
        const requiredKeys = ["scheduleId", "startTime", "duration", "accountId", "type"];
      
        for (const key of requiredKeys) {
          if (!(key in task)) {
            throw new Error(`Missing key "${key}" in the task object`);
          }
        }
      
        const existingSchedule = await prisma.schedule.findFirst({ where: { id: task.scheduleId } });
        if (!existingSchedule) {
          throw new Error('Schedule does not exist to associate the task');
        }
      
        return await prisma.task.create({ data: task });
    }
      

    static async updateTask(id: string, task: any) {
        const existingTask = await TaskService.checkIfTaskExists(id);
        if (!existingTask) {
            throw new Error('Task not found');
        }

        return await prisma.task.update({ where: { id }, data: task });
    }

    static async deleteTask(id: string) {
        await prisma.task.delete({ where: { id } });
    }
}
