import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {


  // constructor(private prisma: PrismaService) { }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  async create(data: CreateUserDto) {
    try {
      let user = await this.prisma.user.create({
        data
      })
      return {
        data: user
      }
    } catch (err) {
      return {
        err
      }
    }
  }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
