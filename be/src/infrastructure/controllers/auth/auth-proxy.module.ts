import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentConfigModule } from 'src/infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ExceptionsModule } from 'src/infrastructure/exceptions/exceptions.module';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositores.module';
import { DatabaseUserRepository } from 'src/infrastructure/repositories/user.repository';
import { BcryptModule } from 'src/infrastructure/services/bcrypt/bcrypt.module';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { IsAuthenticatedUseCases } from 'src/usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule]
})
export class AuthProxyModule {
  //Auth proxy
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: AuthProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            BcryptService,
            ExceptionsService
          ],
          provide: AuthProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService
          ) => {
            return new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService, exceptionService);
          }
        },
        {
          inject: [],
          provide: AuthProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new LogoutUseCases()
        },
        {
          inject: [DatabaseUserRepository],
          provide: AuthProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) => new IsAuthenticatedUseCases(userRepo)
        }
      ],
      exports: [
        AuthProxyModule.LOGIN_USECASES_PROXY,
        AuthProxyModule.LOGOUT_USECASES_PROXY,
        AuthProxyModule.IS_AUTHENTICATED_USECASES_PROXY
      ]
    };
  }
}
