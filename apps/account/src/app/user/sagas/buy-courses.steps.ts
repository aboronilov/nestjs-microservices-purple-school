import { CourseGetCourse, PaymentGenerateLink } from '@purple/contracts';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { PurchaseState } from '@purple/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });
    if (!course) {
      throw new Error(`No course with id ${this.saga.courseId} found`);
    }

    if (course.price == 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      sum: course.price,
      userId: this.saga.user._id,
    });
    this.saga.setState(PurchaseState.WaitingForPayment, course._id);

    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Cannot check payment that is not initialized');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);

    return { user: this.saga.user };
  }
}
