import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { User } from "@prisma/client";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtResponse } from "../types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Req() request: Request): Promise<JwtResponse> {
    return this.authService.login(request.user as User);
  }
}
