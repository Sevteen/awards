import { Paginate, QueryPaginate } from 'src/domain/shared/paginate.interface';
import { Award } from 'src/domain/model/award';
import { AwardRepository, QueryGetAward } from 'src/domain/repositories/awardRepository.interface';

export class GetAwardsUseCases {
  constructor(private readonly awardRepository: AwardRepository) {}

  async getAll(query: QueryGetAward): Promise<Paginate<Award[]>> {
    return await this.awardRepository.findAll(query);
  }

  async getAllByUserId(query: QueryPaginate, userId: number): Promise<Paginate<Award[]>> {
    return await this.awardRepository.findAllByUserId(query, userId);
  }
}
