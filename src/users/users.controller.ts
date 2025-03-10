
import { Controller, Get, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {

  @Get('profile')
  getProfile(@Request() req) {
    const { password, _id, __v, ...user } = req.user;
    return user;

  }
}