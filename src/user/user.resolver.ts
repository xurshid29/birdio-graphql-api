import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "./user.model";
import { UserInput } from "./dto/user.input";
import { UserService } from "./user.service";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Args("input") input: UserInput): Promise<User> {
    const user = await this.userService.register(input);
    return {
      id: user.id,
      email: user.email,
    };
  }
}
