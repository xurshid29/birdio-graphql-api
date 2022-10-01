import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { UserInput } from "./dto/user.input";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: UserInput): Promise<User> {
    const existing = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existing != null) {
      throw new BadRequestException("This email already taken");
    }

    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      },
    });
  }
}
