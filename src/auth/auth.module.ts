import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthLoginResolver } from "./auth-login.resolver";
import { GraphqlJwtAuthGuard } from "./graphql-jwt-auth.guard";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get("JWT_TTL"),
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, GraphqlJwtAuthGuard, AuthLoginResolver],
  exports: [JwtModule],
})
export class AuthModule {}
