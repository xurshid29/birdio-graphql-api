import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, Task } from "@prisma/client";
import { CreateTaskInput } from "./dto/create-task.input";
import { UpdateTaskInput } from "./dto/update-task.input";

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        id,
      },
    });
  }

  async scheduledTasks(
    user: User,
    startDate: Date,
    endDate: Date,
    projectId?: number,
  ): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        NOT: {
          startDate: null,
        },
        AND: [
          {
            startDate: {
              gte: startDate,
            },
          },
          {
            startDate: {
              lte: endDate,
            },
          },
        ],
        project: {
          userId: user.id,
          ...(projectId != null ? { id: projectId } : {}),
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        project: true,
      },
    });
  }

  async create(data: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async update(id: number, data: UpdateTaskInput): Promise<Task> {
    return this.prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }
}
