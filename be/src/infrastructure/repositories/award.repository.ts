import { InjectRepository } from '@nestjs/typeorm';
import { AwardRepository, QueryGetAward } from 'src/domain/repositories/awardRepository.interface';
import { Between, In, Repository } from 'typeorm';
import { Award, AwardItemType } from '../entities/award.entity';
import { Award as IAward } from 'src/domain/model/award';
import { Paginate, QueryPaginate } from 'src/domain/shared/paginate.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseAwardRepository implements AwardRepository {
  constructor(
    @InjectRepository(Award)
    private readonly awardEntityRepository: Repository<Award>
  ) {}

  async findAll(query: QueryGetAward): Promise<Paginate<IAward[]>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;
    query.types = query.types || [];

    const filter = {};
    if (query.minPoint && query.maxPoint) {
      filter['point'] = Between(query.minPoint, query.maxPoint);
    }
    if (query.types && query.types.length) {
      query.types = query.types.filter((x) => AwardItemType[x]).map((type) => type.toLowerCase()) as AwardItemType[];
      filter['type'] = In(query.types);
    }

    const awardsEntity = await this.awardEntityRepository.findAndCount({
      take: limit,
      skip,
      where: { ...filter }
    });

    return { data: awardsEntity[0], totalCount: awardsEntity[1] };
  }

  async findAllByUserId(query: QueryPaginate, userId: number): Promise<Paginate<IAward[]>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const skip = (page - 1) * limit;
    const awardsEntity = await this.awardEntityRepository.findAndCount({
      take: limit,
      skip,
      where: { users: { id: userId } }
    });
    return { data: awardsEntity[0], totalCount: awardsEntity[1] };
  }

  private toAward(awardEntity: Award): IAward {
    const award: IAward = new IAward();

    award.id = awardEntity.id;
    award.name = awardEntity.name;
    award.point = awardEntity.point;
    award.image = awardEntity.image;
    award.type = awardEntity.type;

    return award;
  }
}
