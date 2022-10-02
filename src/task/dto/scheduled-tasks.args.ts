import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty } from "class-validator";

@ArgsType()
export class ScheduledTasksArgs {
  @Field()
  @IsNotEmpty()
  startDate: Date;

  @Field()
  @IsNotEmpty()
  endDate: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsNotEmpty()
  projectId?: number;
}
