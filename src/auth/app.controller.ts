import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './app.service';
import { authDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('users')
  async getUser(): Promise<string> {
    return this.authService.getUser();
  }

  @Post('login')
  login(@Body() dto: authDto) {
    return this.authService.login(dto);
  }
  @Post('signup')
  signup(@Body() dto: authDto) {
    console.log({
      dto: dto,
    });
    return this.authService.signup(dto);
  }
}
