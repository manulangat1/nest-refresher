import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getMe() {
    try {
      return 'Me';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editUser(user: any, dto: any) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstName: dto.firstName,
      },
    });
    return updatedUser;
  }
}
