import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { UserDto } from './dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@GetUser() user: User) {
    // console.log({
    //   user: req.user,
    // });
    return user;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('me')
  editUser(@GetUser() user: User, @Body() dto: UserDto) {
    try {
      return this.userService.editUser(user, dto);
    } catch (error) {
      throw error;
    }
  }
}
