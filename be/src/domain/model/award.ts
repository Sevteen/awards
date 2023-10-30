import { AwardItemType } from 'src/infrastructure/entities/award.entity';

export class Award {
  id: number;
  point: number;
  name: string;
  image: string;
  type: AwardItemType;
}
