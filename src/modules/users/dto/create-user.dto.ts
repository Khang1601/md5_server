import { Allow, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty()
    userName: string;

    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string; 

    @IsNotEmpty()
    avatar: string;
}
