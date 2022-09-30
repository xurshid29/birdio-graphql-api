import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const PUBSUB = "PUBSUB";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUBSUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: config.get("REDIS_HOST"),
            port: config.get("REDIS_PORT"),
          },
        }),
    },
  ],
  exports: [PUBSUB],
})
export class PubsubModule {}
