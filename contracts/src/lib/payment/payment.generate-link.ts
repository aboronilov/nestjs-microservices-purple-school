import { IsNumber, IsString } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsString()
    courseId!: string;

    @IsNumber()
    sum!: number;

    @IsString()
    userId!: string;
  }

  export class Response {
    paymentLink!: string;
  }
}
