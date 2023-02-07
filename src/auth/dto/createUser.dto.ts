import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  firstname: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(32)
  lastname: string;
}
