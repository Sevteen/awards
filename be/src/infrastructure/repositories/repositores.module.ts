import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from '../entities/user.entity';
import { DatabaseUserRepository } from './user.repository';
import { Award } from '../entities/award.entity';
import { DatabaseAwardRepository } from './award.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, Award])],
  providers: [DatabaseUserRepository, DatabaseAwardRepository],
  exports: [DatabaseUserRepository, DatabaseAwardRepository]
})
export class RepositoriesModule {}
