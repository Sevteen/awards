import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { LoggerService } from '../../logger/logger.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { AuthProxyModule } from 'src/infrastructure/controllers/auth/auth-proxy.module';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecase: LoginUseCases,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService
  ) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.logger.warn('LocalStrategy', `Username or password is missing, BadRequestException`);
      this.exceptionService.UnauthorizedException();
    }
    const user = await this.loginUsecase.validateUserForLocalStrategy(email, password);
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid username or password`);
      this.exceptionService.UnauthorizedException({ message: 'Invalid username or password.' });
    }
    return user;
  }
}
