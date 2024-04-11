import { IsString } from 'class-validator';
import { PaymentStatus } from '../payment/payment.check';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.query';

  export class Request {
    @IsString()
    courseId!: string;

    @IsString()
    userId!: string;
  }

  export class Response {
    status!: PaymentStatus;
  }
}
