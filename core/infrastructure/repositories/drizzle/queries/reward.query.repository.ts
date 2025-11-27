import { eq, like } from 'drizzle-orm';

import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardQueryRepository } from '@/core/domain/rewards/reward.query.repository.interface';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { drizzleClient } from '@/core/infrastructure/database/drizzle/db';
import {
  RewardSelect,
  RewardTable,
} from '@/core/infrastructure/database/drizzle/types';

export interface RewardQueryRepositoryDrizzleDep {
  dbClient: drizzleClient;
  rewardTable: RewardTable;
  rewardToDomainMapper: Mapper<RewardSelect, Reward>;
}

export class RewardQueryRepositoryDrizzle implements RewardQueryRepository {
  private readonly dbClient: drizzleClient;
  private readonly rewardTable: RewardTable;
  private readonly rewardToDomainMapper: Mapper<RewardSelect, Reward>;

  constructor(deps: RewardQueryRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.rewardTable = deps.rewardTable;
    this.rewardToDomainMapper = deps.rewardToDomainMapper;
  }

  async findByName(name: string): Promise<Reward[]> {
    const result = await this.dbClient
      .select()
      .from(this.rewardTable)
      .where(like(this.rewardTable.name, `%${name}%`));

    return result.map((c) => this.rewardToDomainMapper.map(c));
  }

  async findAll(): Promise<Reward[]> {
    const dbRewards = await this.dbClient.select().from(this.rewardTable);

    return dbRewards.map((c) => this.rewardToDomainMapper.map(c));
  }

  private async findAllStatus(status: RewardStatus): Promise<Reward[]> {
    const dbRewards = await this.dbClient
      .select()
      .from(this.rewardTable)
      .where(eq(this.rewardTable.isActive, status));

    return dbRewards.map((c) => this.rewardToDomainMapper.map(c));
  }

  async findAllActive(): Promise<Reward[]> {
    return await this.findAllStatus(RewardStatus.Active);
  }

  async findAllInactive(): Promise<Reward[]> {
    return await this.findAllStatus(RewardStatus.Inactive);
  }
}
