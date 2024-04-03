import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@purple/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() registerDto: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return this.authService.register(registerDto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(id);
  }
}
