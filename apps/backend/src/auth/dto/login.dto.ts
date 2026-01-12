import { IsEmail, IsString, MinLength } from 'class-validator';
import { VALIDATION } from '../../config/constants';

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(VALIDATION.MIN_PASSWORD_LENGTH, {
    message: `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`,
  })
  password: string;
}
