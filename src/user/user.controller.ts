import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get("/profile")
  profile(@Req() req: Request) {
    return req.user;
  }
}
