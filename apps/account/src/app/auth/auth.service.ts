import { Injectable } from '@nestjs/common';
import { RegisterDto } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: RegisterDto) {
    const userExists = await this.userRepository.findUser(email);
    if (userExists) {
      throw new Error(`User with email ${email} already exists`);
    }

    const newUserEntity = await new UserEntity({
      email,
      displayName,
      role: UserRole.Student,
      passwordHash: '',
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const userExists = await this.userRepository.findUser(email);
    if (!userExists) {
      throw new Error(`Wrong credentials`);
    }

    const userEntity = new UserEntity(userExists);
    const isPasswordCorrect = await userEntity.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error(`Wrong credentials`);
    }

    return { id: userExists._id };
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}
