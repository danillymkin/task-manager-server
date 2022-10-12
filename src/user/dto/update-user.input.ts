import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNickName } from '../../utils/validation/is-nickname.decorator';

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsString({ message: 'E-Mail должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный E-Mail адрес' })
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Никнейм должен быть строкой' })
  @MinLength(3, { message: 'Не менее 3 символов' })
  @MaxLength(30, { message: 'Не более 30 символов' })
  @IsNickName({
    message: 'Никнейм может содержать только латинские символы и числа',
  })
  @Field({ nullable: true })
  nickName?: string;

  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Не менее 2 символов' })
  @MaxLength(20, { message: 'Не более 20 символов' })
  @Field({ nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Фамилия должна быть строкой' })
  @MinLength(2, { message: 'Не менее 2 символов' })
  @MaxLength(20, { message: 'Не более 20 символов' })
  @Field({ nullable: true })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Описание профиля должно быть строкой' })
  @Field({ nullable: true })
  bio?: string;
}
