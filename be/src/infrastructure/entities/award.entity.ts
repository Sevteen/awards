import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum AwardItemType {
  vouchers = 'vouchers',
  products = 'products',
  giftcard = 'giftcard'
}

@Entity()
export class Award {
  @PrimaryGeneratedColumn()
  @Index({ unique: true })
  id: number;

  @Column('int')
  point: number;

  @Column('text')
  name: string;

  @Column('varchar')
  image: string;

  @Column({
    type: 'enum',
    enum: AwardItemType
  })
  type: AwardItemType;

  @ManyToMany(() => User)
  @JoinTable({ name: 'award_users' })
  users: User[];
}
