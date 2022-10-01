import {
  Resolver,
  Query,
  Args,
  Subscription,
  Mutation,
  Int,
} from "@nestjs/graphql";
import { Inject, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { PUBSUB } from "../pubsub/pubsub.module";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { CurrentUser } from "../auth/graphql-current-user.decorator";
import { User } from "@prisma/client";
import { GraphqlJwtAuthGuard } from "../auth/graphql-jwt-auth.guard";
import { Project } from "./project.model";
import { ProjectService } from "./project.service";
import { CreateProjectInput } from "./dto/create-project.input";
import { UpdateProjectInput } from "./dto/update-project.input";

const PROJECT_ADDED_EVENT = "project-added";
const PROJECT_UPDATED_EVENT = "project-updated";

@UseGuards(GraphqlJwtAuthGuard)
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    @Inject(PUBSUB) private readonly pubsub: RedisPubSub,
  ) {}

  @Query(() => Project)
  async project(@Args("id", { type: () => Int }) id: number) {
    return this.projectService.getById(id);
  }

  @Query(() => [Project], { name: "allProjects" })
  async all(@CurrentUser() user: User) {
    return this.projectService.getAllByUser(user);
  }

  @Subscription(() => Project)
  projectAdded() {
    return this.pubsub.asyncIterator(PROJECT_ADDED_EVENT);
  }

  @Subscription(() => Project)
  projectUpdated() {
    return this.pubsub.asyncIterator(PROJECT_UPDATED_EVENT);
  }

  @Mutation(() => Project, { name: "createProject" })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Args("input") input: CreateProjectInput,
    @CurrentUser() user: User,
  ) {
    const project = await this.projectService.create(user.id, input);
    await this.pubsub.publish(PROJECT_ADDED_EVENT, { project });
    return project;
  }

  @Mutation(() => Project, { name: "updateProject" })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateProjectInput,
  ) {
    const project = await this.projectService.update(id, input);
    await this.pubsub.publish(PROJECT_UPDATED_EVENT, { project });
    return project;
  }
}
