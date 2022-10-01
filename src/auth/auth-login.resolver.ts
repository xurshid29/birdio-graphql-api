import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthLogin } from "./models/auth-login.model";
import { LoginInput } from "./dto/login.input";
import { AuthService } from "./auth.service";
import { BadRequestException } from "@nestjs/common";

@Resolver(() => AuthLogin)
export class AuthLoginResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthLogin)
  async login(@Args("input") input: LoginInput): Promise<AuthLogin> {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );

    if (user == null) {
      throw new BadRequestException("Invalid credentials");
    }

    return {
      accessToken: (await this.authService.login(user)).access_token,
    };
  }
}
