import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { RewardTable } from '@/core/infrastructure/database/drizzle/types';
import { mapDbRewardToDomain } from "@/core/infrastructure/mappers/rewardMapper";
import { eq, like, SQL } from "drizzle-orm";

export class RewardRepositoryDrizzle implements IRewardRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: RewardTable
  ) { }

  async create(reward: Reward): Promise<Reward> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(reward.toPersistence())
      .returning();

    return mapDbRewardToDomain(inserted);
  }

  private async findByCondition(condition: SQL): Promise<Reward[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(condition);

    return result.map(mapDbRewardToDomain);
  }

  async findById(id: number): Promise<Reward | null> {
    const [result] = await this.findByCondition(eq(this.table.id, id));
    return result || null;
  }

  async findByName(name: string): Promise<Reward[]> {
    return await this.findByCondition(like(this.table.name, `%${name}%`));
  }

  async findAll(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table);

    return dbRewards.map(mapDbRewardToDomain);
  }

  async findAllActivated(): Promise<Reward[]> {
    return await this.findByCondition(eq(this.table.isActive, RewardStatus.Active));
  }

  async findAllDeactivated(): Promise<Reward[]> {
    return await this.findByCondition(eq(this.table.isActive, RewardStatus.Inactive));
  }

  async update(reward: Reward): Promise<Reward | null> {
    if (!reward.id) {
      throw new Error("Não é possível atualizar uma recompensa sem ID.");
    }

    const [updated] = await this.db
      .update(this.table)
      .set(reward.toPersistence())
      .where(eq(this.table.id, reward.id))
      .returning();

    if (!updated) return null;

    return mapDbRewardToDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    return (result.changes > 0);
  }
}