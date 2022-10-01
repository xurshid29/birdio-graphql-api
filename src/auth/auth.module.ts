import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthLoginResolver } from "./auth-login.resolver";

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
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    AuthLoginResolver,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
