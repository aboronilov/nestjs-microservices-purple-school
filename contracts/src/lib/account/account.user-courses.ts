import { IUser, IUserCourses } from '@purple/interfaces';
import { IsString } from 'class-validator';

export namespace AccountGetCourses {
  export const topic = 'account.user-courses.query';

  export class Request {
    @IsString()
    id!: string;
  }

  export class Response {
    courses!: IUserCourses[];
  }
}
