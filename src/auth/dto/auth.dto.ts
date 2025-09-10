import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/client.entity';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    company_name: string;
    role: UserRole;
  };
}
