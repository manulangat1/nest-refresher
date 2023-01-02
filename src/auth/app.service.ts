import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async getUser(): Promise<string> {
    const users = await this.prisma.user.findMany();
    console.log(users);
    return ' I am a user';
  }
  async login(dto: authDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new ForbiddenException('User not found');

      const passwordCompares = await argon.verify(user.password, dto.password);

      if (!passwordCompares) {
        throw new ForbiddenException('Credentials not found');
      }

      delete user.password;

      return user;
    } catch (error) {
      throw error;
    }
  }
  async signup(dto: authDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
