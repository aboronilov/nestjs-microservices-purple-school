import { Body, Controller } from '@nestjs/common';
import { AccountChangeProfile } from '@purple/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async userInfo(@Body() { id, user }: AccountChangeProfile.Request) {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new Error(`No user with id ${id}`);
    }

    const userEntity = new UserEntity(existingUser).updateProfile(
      user.displayName
    );
    await this.userRepository.updateUser(userEntity);

    return {};
  }
}
