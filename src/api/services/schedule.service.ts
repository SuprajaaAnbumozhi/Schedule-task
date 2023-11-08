import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
  
export class ScheduleService {
    static async checkIfScheduleExists(id: string) {
        const existingSchedule = await prisma.schedule.findFirst({ where: { id } });
        return existingSchedule;
    }

    static async getSchedules() {
        const schedules = await prisma.schedule.findMany();

        const schedulesWithTasks = await Promise.all(
            schedules.map(async (schedule) => {
                const tasks = await prisma.task.findMany({
                    where: { scheduleId: schedule.id },
                });

                return {
                ...schedule,
                tasks,
                };
            })
        );

        return schedulesWithTasks;
    }
      
    static async getScheduleById(id: string) {

        const schedule = await ScheduleService.checkIfScheduleExists(id);
    
        if (!schedule) {
            throw new Error("Schedule not found");
        }
    
        const tasks = await prisma.task.findMany({
            where: { scheduleId: schedule.id },
          });
    
          return {
            ...schedule,
            tasks,
        };
    }
      
    static async createSchedule(schedule: any) {
        return await prisma.schedule.create({ data: schedule });
    }
    
    static async updateSchedule(id: string, schedule: any) {
        if (!await ScheduleService.checkIfScheduleExists(id)) {
            throw new Error("Schedule not found");
        }
    
        return await prisma.schedule.update({ where: { id }, data: schedule });
    }
    
    static async deleteSchedule(id: string) {
        const existingSchedule = await ScheduleService.getScheduleById(id);
      
        if (!existingSchedule) {
          throw new Error("Schedule not found");
        }
      
        if (existingSchedule.tasks && existingSchedule.tasks.length > 0) {
          throw new Error("Delete the associated tasks first to delete the schedule");
        }
      
        return await prisma.schedule.delete({ where: { id } });
    }  
}
