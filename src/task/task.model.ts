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

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  startTime: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Int)
  projectId: number;

  @Field()
  project: Project;
}
