import { Field, Int, ObjectType } from "@nestjs/graphql";
import { TaskStatus } from "@prisma/client";
import { Project } from "../project/project.model";

@ObjectType()
export class Task {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  status: TaskStatus;

  @Field()
  startTime: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;

  @Field(() => Int)
  projectId: number;

  @Field()
  project: Project;
}
