import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @IsString({ message: 'E-Mail должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный E-Mail адрес' })
  @Field({ nullable: false })
  readonly email!: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Не менее 6 символов' })
  @MaxLength(30, { message: 'Не более 30 символов' })
  @Field({ nullable: false })
  readonly password!: string;

  @IsString({ message: 'Никнейм должен быть строкой' })
  @MinLength(3, { message: 'Не менее 3 символов' })
  @MaxLength(30, { message: 'Не более 30 символов' })
  @Field({ nullable: false })
  readonly nickName!: string;
}
