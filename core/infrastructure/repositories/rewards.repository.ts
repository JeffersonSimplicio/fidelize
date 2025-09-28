import { Reward, RewardCreateProps, RewardUpdateProps } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { RewardTable, RewardSelect } from '@/core/infrastructure/database/drizzle/types';
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

  async findAll(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table);

    return dbRewards.map(mapDbRewardToDomain);
  }

  async update(id: number, data: RewardUpdateProps): Promise<Reward | null> {
    const updateData: Partial<RewardSelect> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.pointsRequired !== undefined) updateData.pointsRequired = data.pointsRequired;
    if (data.description !== undefined) updateData.description = data.description;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    const [updatedReward] = await this.db
      .update(this.table)
      .set(updateData)
      .where(eq(this.table.id, id))
      .returning();

    return mapDbRewardToDomain(updatedReward);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    return (result.changes > 0);
  }
}