import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ["error", "warn", "debug", "verbose"],
    cors: true,
  });

  await app.get(PrismaService).enableShutdownHooks(app);
  await app.listen(3000);
}

void bootstrap();
