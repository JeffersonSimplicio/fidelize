import { RewardCreateProps, Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { RewardTable } from '@/core/infrastructure/database/drizzle/types';
import { mapDbRewardToDomain } from "@/core/infrastructure/mappers/rewardMapper";
import { eq } from "drizzle-orm";

export class RewardRepositoryDrizzle implements IRewardRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: RewardTable
  ) { }

  async create(data: RewardCreateProps): Promise<Reward> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data)
      .returning();

    return mapDbRewardToDomain(inserted);
  }

  async findById(id: number): Promise<Reward | null> {
    const [reward] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));

    if (!reward) return null;
    return mapDbRewardToDomain(reward);
  }
}