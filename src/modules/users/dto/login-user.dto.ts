import { IsNotEmpty, Length } from "class-validator";

export class LoginUserDTO {
    @IsNotEmpty()
    loginId: string;
    @IsNotEmpty()
    password: string;
}