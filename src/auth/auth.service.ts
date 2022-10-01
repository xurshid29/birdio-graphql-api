import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthLogin } from "./models/auth-login.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: username,
      },
    });

    if (user != null) {
      const valid = await bcrypt.compare(password, user.password);
      return valid ? user : null;
    }

    return null;
  }

  signUser(user: User): AuthLogin {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        username: user.email,
      }),
    };
  }
}
