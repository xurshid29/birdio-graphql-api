import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { PubsubModule } from "../pubsub/pubsub.module";
import { PrismaModule } from "../prisma/prisma.module";
import { TaskResolver } from "./task.resolver";

@Module({
  imports: [PubsubModule, PrismaModule],
  providers: [TaskService, TaskResolver],
})
export class TaskModule {}
