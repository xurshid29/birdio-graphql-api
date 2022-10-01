import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthLogin {
  @Field(() => String, { name: "access_token" })
  accessToken: string;
}
