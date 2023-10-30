import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Award } from './award.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Index({ unique: true })
  @Column('citext', { unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @CreateDateColumn({ name: 'create_date' })
  create_date: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updated_date: Date;

  @Column({ nullable: true })
  last_login?: Date;

  @Column('varchar', { nullable: true })
  refresh_token: string;

  @ManyToMany(() => Award)
  @JoinTable({ name: 'user_awards' })
  awards: Award[];
}
