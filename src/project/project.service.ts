import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Project, User } from "@prisma/client";
import { CreateProjectInput } from "./dto/create-project.input";
import { UpdateProjectInput } from "./dto/update-project.input";

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number): Promise<Project> {
    return this.prisma.project.findFirst({
      where: {
        id,
      },
    });
  }

  async getAllByUser(user: User): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async create(userId: number, data: CreateProjectInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: number, data: UpdateProjectInput): Promise<Project> {
    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }
}
