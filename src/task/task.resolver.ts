import {
  Resolver,
  Query,
  Args,
  Subscription,
  Mutation,
  Int,
} from "@nestjs/graphql";
import { Task } from "./task.model";
import { TaskService } from "./task.service";
import { Inject, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { PUBSUB } from "../pubsub/pubsub.module";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { CurrentUser } from "../auth/graphql-current-user.decorator";
import { User } from "@prisma/client";
import { GraphqlJwtAuthGuard } from "../auth/graphql-jwt-auth.guard";
import { CreateTaskInput } from "./dto/create-task.input";
import { UpdateTaskInput } from "./dto/update-task.input";
import { ScheduledTasksArgs } from "./dto/scheduled-tasks.args";

const TASK_ADDED_EVENT = "task-added";
const TASK_UPDATED_EVENT = "task-updated";

@UseGuards(GraphqlJwtAuthGuard)
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    @Inject(PUBSUB) private readonly pubsub: RedisPubSub,
  ) {}

  @Query(() => Task, { nullable: true })
  async task(@Args("id", { type: () => Int }) id: number) {
    return this.taskService.getById(id);
  }

  @Query(() => [Task], { name: "scheduledTasks" })
  async scheduled(
    @CurrentUser() user: User,
    @Args() tasksArgs: ScheduledTasksArgs,
  ) {
    return this.taskService.scheduledTasks(
      user,
      tasksArgs.startDate,
      tasksArgs.endDate,
      tasksArgs.projectId,
    );
  }

  @Subscription(() => Task)
  taskAdded() {
    return this.pubsub.asyncIterator(TASK_ADDED_EVENT);
  }

  @Subscription(() => Task)
  taskUpdated() {
    return this.pubsub.asyncIterator(TASK_UPDATED_EVENT);
  }

  @Mutation(() => Task, { name: "createTask" })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Args("input") input: CreateTaskInput) {
    const task = await this.taskService.create(input);
    await this.pubsub.publish(TASK_ADDED_EVENT, { task });
    return task;
  }

  @Mutation(() => Task, { name: "updateTask" })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateTaskInput,
  ) {
    const task = await this.taskService.update(id, input);
    await this.pubsub.publish(TASK_UPDATED_EVENT, { task });
    return task;
  }
}
