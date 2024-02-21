import { PrismaClient, UserRole } from '@prisma/client'
const prisma = new PrismaClient()
import {hashSync} from 'bcrypt'
async function main() {
    try {
        await prisma.users.create({
            data: {
                avatar: "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
                createAt: String(Date.now()),
                email: "khang.nodejs@gmail.com",
                password: hashSync("123", 2),
                updateAt:  String(Date.now()),
                userName: "admin",
                role: UserRole.admin
            }
        })
    }catch(err) {

    }
}

main();