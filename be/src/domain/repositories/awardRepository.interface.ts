import { Paginate, QueryPaginate } from './../shared/paginate.interface';
import { Award } from '../model/award';
import { AwardItemType } from 'src/infrastructure/entities/award.entity';

export interface QueryGetAward extends QueryPaginate {
  minPoint?: number;
  maxPoint?: number;
  types?: AwardItemType[];
}

export interface AwardRepository {
  findAll(query: QueryGetAward): Promise<Paginate<Award[]>>;
  findAllByUserId(query: QueryPaginate, userId: number): Promise<Paginate<Award[]>>;
}
