import { IsEmail, IsString, IsOptional } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString()
    @IsOptional()
    displayName?: string;
  }

  export class Response {
    email!: string;
  }
}
