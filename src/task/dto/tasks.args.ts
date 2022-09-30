import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty } from "class-validator";

@ArgsType()
export class TasksArgs {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  projectId: number;
}
