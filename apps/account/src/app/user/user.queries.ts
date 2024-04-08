import { Body, Controller } from '@nestjs/common';
import { AccountGetCourses, AccountUserInfo } from '@purple/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(
    @Body() { id }: AccountUserInfo.Request
  ): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);

    return { user };
  }

  @RMQValidate()
  @RMQRoute(AccountGetCourses.topic)
  async userCourses(
    @Body() { id }: AccountGetCourses.Request
  ): Promise<AccountGetCourses.Response> {
    const user = await this.userRepository.findUserById(id);
    const { courses } = user;

    return { courses };
  }
}
