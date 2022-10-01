import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user.model";
import { UserInput } from "./dto/user.input";
import { UserService } from "./user.service";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { GraphqlJwtAuthGuard } from "../auth/graphql-jwt-auth.guard";
import { CurrentUser } from "../auth/graphql-current-user.decorator";
import { Project } from "../project/project.model";

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

  @UseGuards(GraphqlJwtAuthGuard)
  @Query(() => User)
  async profile(@CurrentUser() user: User): Promise<User> {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
