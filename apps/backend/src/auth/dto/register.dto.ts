import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { VALIDATION } from '../../config/constants';

export class RegisterDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(VALIDATION.MIN_NAME_LENGTH, {
    message: `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`,
  })
  @MaxLength(VALIDATION.MAX_NAME_LENGTH, {
    message: `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`,
  })
  name: string;

  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(VALIDATION.MIN_PASSWORD_LENGTH, {
    message: `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`,
  })
  password: string;
}
