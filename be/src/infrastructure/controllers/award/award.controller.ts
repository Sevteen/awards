import { Controller, Get, HttpCode, HttpStatus, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import { GetAwardsUseCases } from 'src/usecases/award/getAwards.usecases';
import { AwardProxyModule } from './award-proxy.module';

@Controller('awards')
export class AwardController {
  constructor(
    @Inject(AwardProxyModule.GET_ALL_AWARDS)
    @Inject(AwardProxyModule.GET_ALL_AWARDS_BY_USER_ID)
    private readonly getAwardsUseCase: GetAwardsUseCases
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'get all awards' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllAwards(@Req() request: any) {
    return await this.getAwardsUseCase.getAll(request.query);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'get all awards by user id' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllAwardsByUserId(@Req() request: any) {
    return await this.getAwardsUseCase.getAllByUserId(request.query, request.user.id);
  }
}
