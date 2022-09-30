import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class CreateTaskInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  startTime?: Date;

  @Field(() => Int)
  projectId: number;
}
