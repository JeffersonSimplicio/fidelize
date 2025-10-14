import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardQueryRepository } from "@/core/domain/rewards/reward.query.repository.interface";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { RewardSelect, RewardTable } from "@/core/infrastructure/database/drizzle/types";
import { eq, like } from "drizzle-orm";

export class RewardQueryRepositoryDrizzle implements RewardQueryRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: RewardTable,
    private readonly mapper: Mapper<RewardSelect, Reward>,
  ) { }

  async findByName(name: string): Promise<Reward[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(like(this.table.name, `%${name}%`));

    return result.map(this.mapper.map);
  }

  async findAll(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table);

    return dbRewards.map(this.mapper.map);
  }

  async findAllActive(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isActive, RewardStatus.Active));

    return dbRewards.map(this.mapper.map);
  }

  async findAllInactive(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isActive, RewardStatus.Inactive));

    return dbRewards.map(this.mapper.map);
  }
}