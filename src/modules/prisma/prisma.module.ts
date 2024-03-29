
import { Module, Global } from '@nestjs/common';
import PrismaService from './prisma.service';

@Global() // de sai o bat ki noi nao
@Module({
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService], // xuat ra cho th khac sai
})
export default class PrismaModule {}
