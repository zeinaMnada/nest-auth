import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { isEmail } from 'validator';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/interfaces/user.interface';
import { CreateUserDTO } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(user: User): Promise<string> {
    const { password, ...payload } = user;
    return this.jwtService.signAsync(payload);
  }

  async signIn(email: string, pass: string): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      Logger.warn(`User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatching) {
      Logger.warn(`Invalid credentials for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    Logger.log(`SignIn successful for email: ${email}`);
    return {
      accessToken: await this.generateAccessToken(user),
    };
  }

  async signUp(data: CreateUserDTO): Promise<{ accessToken: string }> {
    // Validate params
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (data.name.length < 3 || !isEmail(data.email) || !passwordRegex.test(data.password)) {
      throw new BadRequestException('Invalid params');
    }
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;
    const newUser = await this.userService.createUser(data);
    Logger.log(`SignUp successful for email: ${data.email}`);
    return {
      accessToken: await this.generateAccessToken(newUser),
    };  
  }

  async signOut(): Promise<{ message: string }> {
    // To invalidating this token it can be put in a blacklist on redis,
    // but for now will just return a message and remove token from client
    Logger.log(`SignOut successful`);
    return { message: 'SignOut successful' };
  }

}
