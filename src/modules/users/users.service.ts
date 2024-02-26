import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import PrismaService from '../prisma/prisma.service'
import { ServiceCreateRes } from './interfaces/service-create-interface';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  async create(newUser: CreateUserDto) {
    try {
      let user = await this.prisma.users.create({
        data: {
          ...newUser,
          createAt: String(Date.now()),
          updateAt: String(Date.now()),
        }
      })
      return {
        data: user
      }
    } catch (err) {
      console.log("err", err)
      return {
        err
      }
    }
  }

  async findById(id: number) {
    try {
      let user = await this.prisma.users.findUnique({
        where: {
          id: Number(id)
        }
      })
      return {
        err: null,
        data: user
      }
    } catch (err) {
      return {
        err,
        data: null
      }
    }
  }

  async updateById(id: number, data: any) {
    try {
      let user = await this.prisma.users.update({
        where: {
          id: Number(id)
        },
        data
      })
      return {
        err: null,
        data: user
      }
    } catch (err) {
      return {
        err,
        data: null
      }
    }
  }

  async findByEmailOrUserName(loginId: string, googleType = false) {
    try {
      let user = await this.prisma.users.findFirst({
        where: {
          OR: [
            googleType ? { email: loginId } : { email: loginId, emailAuthen: true },
            { userName: loginId }
          ]
        },
        include: {
          ipList: true
        }
      })
      if (!user) throw ("Không tìm thấy người dùng")
      return {
        data: user
      }
    } catch (err) {
      return {
        err
      }
    }
  }

  async addIp(userId: number, newIp: string) {
    try {
      let ip = await this.prisma.user_ips.create({
        data: {
          userId,
          ip: newIp
        }
      })
      return {
        err: null,
        data: ip
      }
    } catch (err) {
      return {
        err
      }
    }
  }
}
