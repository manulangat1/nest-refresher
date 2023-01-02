import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('SECRET_KEY'),
    });
  }
  async validate(payload: any) {
    console.log({ payload });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
        // email: payload.email,
      },
    });
    delete user.password;
    if (!user) {
      throw new ForbiddenException('You are not logged in');
    }
    return user;
  }
}
