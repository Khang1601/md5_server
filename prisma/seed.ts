import { PrismaClient, UserRole, UserStatus } from '@prisma/client'
const prisma = new PrismaClient()
import {hashSync} from 'bcrypt'

async function main() {
    try {
        console.log("-------da chay file seed-------");
        
        await prisma.users.create({
            data: {
                avatar: "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
                email: "khang.nodejs@gmail.com",
                userName: "admin",
                password: hashSync("123", 2),
                createAt: String(Date.now()),
                updateAt:  String(Date.now()),
                role: UserRole.admin,
                status: UserStatus.active
            }
        })


        const categoriesData = [
            { title: "Shoes", avatar: "https://png.pngtree.com/png-clipart/20201209/original/pngtree-shoes-icon-design-template-illustration-png-image_5679703.jpg" },
            { title: "Bags", avatar: "https://w7.pngwing.com/pngs/568/582/png-transparent-shopping-bags-trolleys-bag-accessories-sticker-shopping-bags-trolleys-thumbnail.png" },
            { title: "Hats", avatar: "https://png.pngtree.com/element_our/20190531/ourmid/pngtree-free-cartoon-black-hat-image_1321651.jpg" }
          ];
          
          for (const category of categoriesData) {
            await prisma.categories.create({ data: category });
          }
        
    }catch(err) {

    }
}

main();