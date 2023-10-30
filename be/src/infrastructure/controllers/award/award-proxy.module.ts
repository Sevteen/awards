import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseAwardRepository } from 'src/infrastructure/repositories/award.repository';
import { RepositoriesModule } from 'src/infrastructure/repositories/repositores.module';
import { GetAwardsUseCases } from 'src/usecases/award/getAwards.usecases';

@Module({
  imports: [RepositoriesModule]
})
export class AwardProxyModule {
  //Award Proxy

  static GET_ALL_AWARDS = 'GetAllAwardsUseCasesProxy';
  static GET_ALL_AWARDS_BY_USER_ID = 'GetAllAwardsByUserIdUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: AwardProxyModule,
      providers: [
        {
          inject: [DatabaseAwardRepository],
          provide: AwardProxyModule.GET_ALL_AWARDS,
          useFactory: (awardRepo: DatabaseAwardRepository) => new GetAwardsUseCases(awardRepo)
        },
        {
          inject: [DatabaseAwardRepository],
          provide: AwardProxyModule.GET_ALL_AWARDS_BY_USER_ID,
          useFactory: (awardRepo: DatabaseAwardRepository) => new GetAwardsUseCases(awardRepo)
        }
      ],
      exports: [AwardProxyModule.GET_ALL_AWARDS, AwardProxyModule.GET_ALL_AWARDS_BY_USER_ID]
    };
  }
}
