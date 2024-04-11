import { Injectable } from '@nestjs/common';
import { IUser } from '@purple/interfaces';
import { UserRepository } from './repositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UserEventEmmiter } from './user.event-emmiter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmmiter
  ) {}

  public async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new Error(`No user with id ${id}`);
    }

    const userEntity = new UserEntity(existingUser).updateProfile(
      user.displayName
    );
    await this.updateUser(userEntity);

    return {};
  }

  public async buyCourse(userId: string, courseId: string) {
    const userExists = await this.userRepository.findUserById(userId);
    if (!userExists) {
      throw new Error(`No user found with id ${userId}`);
    }
    const userEntity = new UserEntity(userExists);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, paymentLink } = await saga.getState().pay();
    await this.updateUser(user);

    return { paymentLink };
  }

  public async checkPayment(userId: string, courseId: string) {
    const userExists = await this.userRepository.findUserById(userId);
    if (!userExists) {
      throw new Error(`No user found with id ${userId}`);
    }
    const userEntity = new UserEntity(userExists);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { user, status } = await saga.getState().checkPayment();
    await this.updateUser(user);

    return { status };
  }

  private async updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}
