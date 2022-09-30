import { join } from "node:path";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ProjectModule } from "./project/project.module";
import { TaskModule } from "./task/task.module";
import { PubsubModule } from "./pubsub/pubsub.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProjectModule,
    TaskModule,
    PubsubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
