import { Field, InputType } from "@nestjs/graphql";
import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsDefined()
  @IsNotEmpty()
  password: string;
}
