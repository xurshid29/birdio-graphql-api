import { PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      email: `test1@test.te`,
      password: await bcrypt.hash("test", 10),
    } as User,
  });
}

void main();
