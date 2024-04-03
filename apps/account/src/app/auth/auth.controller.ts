import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@purple/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(id);
  }
}
