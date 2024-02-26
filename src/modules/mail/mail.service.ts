import { Injectable } from "@nestjs/common";
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { MailOption, SendMailFn } from "./interfaces/mail.interface";
import * as Mailgen from 'mailgen';

// console.log("Mailgen", Mailgen)
@Injectable()
export class MailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
    });

    // async sendMail(option: MailOption):Promise<boolean> {
    //     try {
    //         await this.transporter.sendMail(option);
    //         return true
    //     }catch(err: any) {
    //         return false
    //     }
    // }

    sendMail: SendMailFn = async (to: string, subject: string, html: string, from: string = process.env.MAIL_ID): Promise<boolean> => {
        try {
            let option: MailOption = {
                from,
                to,
                subject,
                html
            }
            await this.transporter.sendMail(option);
            return true
        } catch (err: any) {
            return false
        }
    }
}


export const template = {
    emailConfrim: (userName: string, link: string):string => {
        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Khangshop',
                link: 'http://localhost:5173'
            }
        });

        var email = {
            body: {
                name: userName,
                intro: 'Welcome to Khangshop! Chúng tôi rất vui vì bạn đã tham gia cộng đồng Khangshop.',
                action: {
                    instructions: 'Để có thể truy cập vào các tính năng nâng cao, bạn vui lòng bấm vào liên kết bên dưới để xác thực.',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your email',
                        link
                    }
                },
                outro: 'Nếu bạn gặp bất kỳ khó khăn nào, hãy trả lời email này chúng tôi sẽ giúp bạn!',
                signature: "Trân trọng"
            }
        };

        var emailString = mailGenerator.generate(email);
        return emailString
    }
}
/* ctr + . */