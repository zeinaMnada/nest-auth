import { Body, Controller, HttpCode, HttpStatus, Post, Logger, InternalServerErrorException } from '@nestjs/common';
import { Public } from './constants';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() data: CreateUserDTO) {
    Logger.log(`SignIn attempt for email: ${data.email}`);
    try {
      return await this.authService.signIn(data.email, data.password);
    } catch (error) {
      Logger.error(`SignIn failed for email: ${data.email}`, error.stack);
      throw new InternalServerErrorException('SignIn failed');
    }
  }

  @Public()
  @Post('signup')
  async signUp(@Body() data: CreateUserDTO) {
    Logger.log(`SignUp attempt for email: ${data.email}`);
    try {
      return await this.authService.signUp(data);
    } catch (error) {
      Logger.error(`SignUp failed for email: ${data.email}`, error.stack);
      throw new InternalServerErrorException('SignUp failed');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Body() data: CreateUserDTO) {
    Logger.log(`SignOut attempt`);
    try {
      return this.authService.signOut();
    } catch (error) {
      Logger.error('SignOut failed', error.stack);
      throw new InternalServerErrorException('SignOut failed');
    }
  }
}
