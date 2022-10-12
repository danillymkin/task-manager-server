import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsNickNameConstraint implements ValidatorConstraintInterface {
  validate(nickName: any): boolean {
    const regExp = new RegExp(/^[a-zA-Z0-9]{3,30}$/);
    return regExp.test(nickName);
  }
}

export function IsNickName(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNickNameConstraint,
    });
  };
}
