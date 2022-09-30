import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
