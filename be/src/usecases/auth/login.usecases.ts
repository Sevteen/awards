import { HttpStatus } from '@nestjs/common';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { IJwtService, IJwtServicePayload } from 'src/domain/adapters/jwt.interface';
import { JWTConfig } from 'src/domain/config/jwt.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM, UserWithoutPassword } from 'src/domain/model/user';
import { UserRepository } from 'src/domain/repositories/userRepository.interface';
import { AuthRegisterDto } from 'src/infrastructure/controllers/auth/auth.dto';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: ExceptionsService
  ) {}

  generateJwt(user: Omit<UserWithoutPassword, 'hashRefreshToken'>, refreshJwt = false) {
    this.logger.log('Generate JWT', `The user ${user.email} request to generate JWT.`);

    const payload: IJwtServicePayload = { ...user };
    const secret = refreshJwt ? this.jwtConfig.getJwtRefreshSecret() : this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return token;
  }

  async registerCheck(email: string) {
    const existUser = await this.userRepository.getUserByEmail(email);

    return { isExist: Boolean(existUser) };
  }

  async getCookieWithJwtToken(user: UserM, token: string) {
    this.logger.log('LoginUseCases execute', `The user ${user.email} have been logged.`);
    return `Authentication=${token}; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
  }

  async getCookieWithJwtRefreshToken(user: UserM, token: string) {
    this.logger.log('LoginUseCases execute', `The user ${user.email} have been logged.`);
    await this.setCurrentRefreshToken(token, user.email);
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
    return cookie;
  }

  async registerUser(registrationData: AuthRegisterDto) {
    const existingUser = await this.userRepository.getUserByEmail(registrationData.email);
    if (existingUser) {
      return this.exceptionService.badRequestException({ message: 'Email is already registered' });
    }

    const payload = { ...registrationData };
    payload.password = await this.bcryptService.hash(payload.password);

    await this.userRepository.createUser(payload);
  }

  async validateUserForLocalStrategy(email: string, pass: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      this.exceptionService.UnauthorizedException({ message: 'Invalid email or password.' });
      return null;
    }
    const match = await this.bcryptService.compare(pass, user.password);
    if (user && match) {
      await this.updateLoginTime(user.email);
      const { password, hashRefreshToken, ...result } = user;
      const token = this.generateJwt(result);
      const accessTokenCookie = await this.getCookieWithJwtToken(user, token);
      const refreshToken = this.generateJwt(result, true);
      const refreshTokenCookie = await this.getCookieWithJwtRefreshToken(user, refreshToken);

      return { ...result, token, refreshTokenCookie, accessTokenCookie };
    }
    this.exceptionService.UnauthorizedException({ message: 'Invalid email or password.' });
  }

  async validateUserForJWTStrategy(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateLoginTime(email: string) {
    await this.userRepository.updateLastLogin(email);
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateRefreshToken(email, currentHashedRefreshToken);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(refreshToken, user.hashRefreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
