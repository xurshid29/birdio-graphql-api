import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtResponse } from "../types";

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

  async login(user: User): Promise<JwtResponse> {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.email,
      }),
    };
  }
}
