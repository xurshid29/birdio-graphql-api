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
import { Inject, UseGuards } from "@nestjs/common";
import { PUBSUB } from "../pubsub/pubsub.module";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { CurrentUser } from "../auth/graphql-current-user.decorator";
import { User } from "@prisma/client";
import { TasksArgs } from "./dto/tasks.args";
import { GraphqlJwtAuthGuard } from "../auth/graphql-jwt-auth.guard";
import { CreateTaskInput } from "./dto/create-task.input";
import { UpdateTaskInput } from "./dto/update-task.input";

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

  @Query(() => [Task], { name: "allTasks" })
  async all(@CurrentUser() user: User) {
    return this.taskService.getAllByUser(user);
  }

  @Query(() => [Task])
  async tasksByProject(@Args() tasksArgs: TasksArgs) {
    return this.taskService.getAllByProject(tasksArgs.projectId);
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
  async create(@Args("input") input: CreateTaskInput) {
    const task = await this.taskService.create(input);
    await this.pubsub.publish(TASK_ADDED_EVENT, { task });
    return task;
  }

  @Mutation(() => Task, { name: "updateTask" })
  async update(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateTaskInput,
  ) {
    const task = await this.taskService.update(id, input);
    await this.pubsub.publish(TASK_UPDATED_EVENT, { task });
    return task;
  }
}
