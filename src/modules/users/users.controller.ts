import { Controller, Get, Post, Body, Patch, Param, Delete, Version, Res, Ip, Header, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { MailService, template } from '../mail/mail.service';
import { util } from 'src/utils';
import { LoginUserDTO } from './dto/login-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import axios from 'axios';

import * as Mailgen from 'mailgen';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private mailService: MailService) { }

  //google-login
  @Post('google-login')
  async loginGoogle(@Body() body: {
    token: string
  }, @Res() res:Response) {
    try {
        let googleRes = await axios.post(`${process.env.GOOGLE_VALIDATE_TOKEN_API}${process.env.GOOGLE_FB_KEY}`, {
          idToken: body.token
        });
        //photoUrl
        let {data, err} = await this.usersService.findByEmailOrUserName(googleRes.data.users[0].email, true);
        if(err) {
          /* google email chưa tồn tại => create new user => create token => send client */
          let newUser = {
            userName: String(Math.ceil(Date.now() * Math.random())),
            password: hashSync(String(Math.ceil(Date.now() * Math.random())), 2),
            email: googleRes.data.users[0].email,
            emailAuthen: true,
            createAt: String(Date.now()),
            updateAt: String(Date.now()),
            avatar: googleRes.data.users[0].photoUrl
          }
          let newUserRes = await this.usersService.create(newUser);
          if(newUserRes.err) {
            throw false
          }
          return res.status(200).json({
            token: util.token.createToken(newUserRes.data, "1d")
          })   
        }else {
          return res.status(200).json({
            token: util.token.createToken(data, "1d")
          })   
        }
    }catch(err) {
      /* google email tồn tại => create token => send client */
      return res.status(413).json({
        message:  "Lỗi gì đó"
      })
    }
  }

  // //github-login
  // @Post('google-login')
  // async githubGoogle(@Body() body: {
  //   token: string
  // }, @Res() res:Response) {
  //   try {
  //       let githubRes = await axios.post(`${process.env.GITHUB_VALIDATE_TOKEN_API}${process.env.GITHUB_FB_KEY}`, {
  //         idToken: body.token
  //       });
  //       //photoUrl
  //       let {data, err} = await this.usersService.findByEmailOrUserName(githubRes.data.users[0].email, true);
  //       if(err) {
  //         /* google email chưa tồn tại => create new user => create token => send client */
  //         let newUser = {
  //           userName: String(Math.ceil(Date.now() * Math.random())),
  //           password: hashSync(String(Math.ceil(Date.now() * Math.random())), 10),
  //           email: githubRes.data.users[0].email,
  //           emailAuthen: true,
  //           createAt: String(Date.now()),
  //           updateAt: String(Date.now()),
  //           avatar: githubRes.data.users[0].photoUrl
  //         }
  //         let newUserRes = await this.usersService.create(newUser);
  //         if(newUserRes.err) {
  //           throw false
  //         }
  //         return res.status(200).json({
  //           token: util.token.createToken(newUserRes.data, "1d")
  //         })   
  //       }else {
  //         return res.status(200).json({
  //           token: util.token.createToken(data, "1d")
  //         })   
  //       }
  //   }catch(err) {
  //     /* google email tồn tại => create token => send client */
  //     return res.status(413).json({
  //       message:  "Loi gi do"
  //     })
  //   }
  // }


  @Post('login')
  async login(@Ip() ip: string, @Body() body: LoginUserDTO, @Res() res: Response) {
    try {
      let {data, err} = await this.usersService.findByEmailOrUserName(body.loginId);
  
      if(err) {
        throw "Không tìm thấy người dùng!"
      }
      if(compareSync(body.password, data.password) == false) {
        throw "Tài khoản hoặc mật khẩu không chính xác!"
      }

      if(!data.ipList.find(ipItem => ipItem.ip == ip)) {

        let htmlString = 
        `
        <h3>Tài khoản của bạn đang có truy cập tại ip: <b>${ip}</b>, bấm vào liên kết bên dưới để xác thực!</h3>
        <a href="http://127.0.0.1:3000/api/v1/users/ip-confirm/${util.token.createToken(
          {...data, newIp: ip}, String(5*30*1000)
        )}">Xac thuc ip</a>
        `

        this.mailService.sendMail(data.email, "Xác thực vị trí đăng nhập mới", htmlString)
        throw "Vui lòng vào email để xác thực vị trí đăng nhập mới"


              
        
      
      }
      
      return res.status(200).json({
        token: util.token.createToken(data, "1d")
      })   
    }catch(err) {
      return res.status(413).json({
        message: err
      })
    }
  }

  @Post()
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    try {
      let result = await this.usersService.create({
        ...body,
        password: hashSync(body.password, 2)
      });
      if (result.err) {
        if (result.err?.meta?.target == "users_userName_key") {
          throw "User name đã tồn tại"
        }
        if (result.err?.meta?.target == "users_email_key") {
          throw "Email đã tồn tại"
        }
        throw "Lỗi gì đó"
      }

      /* send mail */

      let token = util.token.createToken(result.data, String(5 * 60 * 1000));

      this.mailService.sendMail(result.data.email,
        "gửi mail nè", template.emailConfrim(result.data.userName, `${process.env.SV_HOST}/users/email-confirm/${token}`))

      return res.status(200).json({
        message: "ok!",
        data: result.data
      })
    } catch (err) {
      return res.status(500).json({
        message: err
      })
    }
  }
 
  @Get('email-confirm/:token')
  async emailConfirm(@Param('token') token: string, @Res() res: Response) {
      try {
        let tokenData = util.token.decodeToken(token);
        if(!tokenData) {
          throw "Token in valid!"
        }
        let user = await this.usersService.findById(tokenData.id)

        if(user.err) {
          throw "User không tìm thấy"
        }

        if(user.data.updateAt != tokenData.updateAt) {
          throw "Token in valid!"
        }

        let userUpdate = await this.usersService.updateById(tokenData.id, {
          emailAuthen: true,
          updateAt: String(Date.now())
        })

        if(userUpdate.err) {
          throw "Update email failed"
        }

        return res.status(200).send("Email Confirm ok!")

      }catch(err) {
        return res.status(500).json({
          message: err
        })
      }
  }

  @Get('ip-confirm/:token')
  async ipConfirm(@Param('token') token: string, @Res() res: Response) { 
      try {
        let tokenData = util.token.decodeToken(token);
        if(!tokenData) {
          throw "Token in valid!"
        }
        let user = await this.usersService.findById(tokenData.id)

        if(user.err) {
          throw "User không tìm thấy"
        }

        if(user.data.updateAt != tokenData.updateAt) {
          throw "Token in valid!"
        }

        let userUpdate = await this.usersService.addIp(tokenData.id, tokenData.newIp)

        if(userUpdate.err) {
          throw "Update email failed"
        }

        return res.status(200).send("Ip Confirm ok!")

      }catch(err) {
        return res.status(500).send("Ip Confirm fail!")
      }
  }

  @Get()
  async getUserData(@Req() req: Request, @Res() res: Response) {
      try {
        let tokenData = util.token.decodeToken(String(req.headers.token)); 
        if(!tokenData) {   
          throw "Token in valid!"
        }
        let {data, err} = await this.usersService.findById(tokenData.id)

        if(err) {
          throw "User không tìm thấy"
        }

        if(data.updateAt != tokenData.updateAt) {
          throw "Token in valid!"
        }

        return res.status(200).json({
          data
        })

      }catch(err) {
        return res.status(413).json({
          message: err
        })
      }
  }


}
