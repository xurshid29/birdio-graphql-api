import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { PrismaModule } from "../prisma/prisma.module";
import { PubsubModule } from "../pubsub/pubsub.module";
import { ProjectResolver } from "./project.resolver";

@Module({
  imports: [PubsubModule, PrismaModule],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
