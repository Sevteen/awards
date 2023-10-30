import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthLoginDto, AuthRegisterCheckDto, AuthRegisterDto } from './auth.dto';
import { IsAuthPresenter } from './auth.presenter';

import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard';

import { IsAuthenticatedUseCases } from '../../../usecases/auth/isAuthenticated.usecases';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { LogoutUseCases } from '../../../usecases/auth/logout.usecases';
import { AuthProxyModule } from './auth-proxy.module';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found'
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(AuthProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecase: LoginUseCases,
    @Inject(AuthProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecase: LogoutUseCases,
    @Inject(AuthProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecase: IsAuthenticatedUseCases
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'signup' })
  async register(@Body() body: AuthRegisterDto) {
    return await this.loginUsecase.registerUser(body);
  }

  @Post('registerCheck')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthRegisterCheckDto })
  @ApiOperation({ description: 'verify email for login' })
  async registerCheck(@Body() body: AuthRegisterCheckDto) {
    return await this.loginUsecase.registerCheck(body.email);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const userInfo = await this.loginUsecase.validateUserForLocalStrategy(auth.email, auth.password);
    if (userInfo) {
      request.res.setHeader('Set-Cookie', [userInfo.accessTokenCookie, userInfo.refreshTokenCookie]);
      delete userInfo.accessTokenCookie;
      delete userInfo.refreshTokenCookie;
      return userInfo;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecase.execute();
    request.res.setHeader('Set-Cookie', cookie);
  }

  @Get('verify')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'verify login' })
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecase.execute(request.user.email);
    const response = new IsAuthPresenter();
    response.email = user.email;
    return response;
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() request: any) {
    const accessTokenCookie = await this.loginUsecase.getCookieWithJwtToken(request.user, request.user.newAccessToken);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
  }
}
