import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'

@Injectable()
export default class PrismaService extends PrismaClient {}



/*
Đây là khai báo class PrismaService mở rộng từ PrismaClient. 
Điều này có nghĩa là PrismaService sẽ có tất cả các phương thức và tính năng của PrismaClient. 
Bằng cách này, có thể sử dụng PrismaService để tương tác với cơ sở dữ liệu thông qua Prisma.

Với cấu trúc này, khi bạn muốn sử dụng Prisma để truy cập cơ sở dữ liệu trong ứng dụng NestJS của mình, bạn có thể inject PrismaService vào các thành phần khác, và sử dụng các phương thức được cung cấp bởi PrismaClient thông qua PrismaService
*/