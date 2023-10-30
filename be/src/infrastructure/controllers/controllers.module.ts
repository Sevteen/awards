import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { AuthProxyModule } from './auth/auth-proxy.module';
import { AuthController } from './auth/auth.controller';
import { LocalStrategy } from '../common/strategies/local.strategy';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../common/strategies/jwtRefresh.strategy';
import { LoggerModule } from '../logger/logger.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { JwtModule as JwtServiceModule } from 'src/infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { PassportModule } from '@nestjs/passport';
import { AwardController } from './award/award.controller';
import { AwardProxyModule } from './award/award-proxy.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
    AuthProxyModule.register(),
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    PassportModule,
    AwardProxyModule.register()
  ],
  controllers: [AuthController, AwardController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [AuthProxyModule.register(), AwardProxyModule.register()]
})
export class ControllersModule {}
