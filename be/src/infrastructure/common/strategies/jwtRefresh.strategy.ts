import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { LoggerService } from '../../logger/logger.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { TokenPayload } from 'src/domain/model/auth';
import { AuthProxyModule } from 'src/infrastructure/controllers/auth/auth-proxy.module';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(AuthProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecase: LoginUseCases,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        }
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const user = await this.loginUsecase.getUserIfRefreshTokenMatches(refreshToken, payload.email);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      this.exceptionService.UnauthorizedException({ message: 'User not found or hash not correct' });
    }

    const { password, hashRefreshToken, ...userData } = user;

    const newAccessToken = this.loginUsecase.generateJwt(userData);
    return { user, newAccessToken };
  }
}
