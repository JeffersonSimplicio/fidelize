import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { RewardTable } from '@/core/infrastructure/database/drizzle/types';
import { mapDbRewardToDomain } from "@/core/infrastructure/mappers/rewardMapper";
import { eq, like } from "drizzle-orm";
import { RewardStatus } from "@/core/domain/rewards/reward-status"

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

  async findById(id: number): Promise<Reward | null> {
    const [reward] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));

    if (!reward) return null;
    return mapDbRewardToDomain(reward);
  }

  async findByName(name: string): Promise<Reward[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table)
      .where(like(this.table.name, `%${name}%`));

    return dbCustomers.map(mapDbRewardToDomain);
  }

  async findAll(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table);

    return dbRewards.map(mapDbRewardToDomain);
  }

  async findAllActivated(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isActive, RewardStatus.Active));

    return dbRewards.map(mapDbRewardToDomain);
  }

  async findAllDeactivated(): Promise<Reward[]> {
    const dbRewards = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.isActive, RewardStatus.Inactive));

    return dbRewards.map(mapDbRewardToDomain);
  }

  async update(reward: Reward): Promise<Reward | null> {
    if (!reward.id) {
      throw new Error("Não é possível atualizar uma recompensa sem ID.");
    }

    const [updated] = await this.db
      .update(this.table)
      .set({
        name: reward.name,
        pointsRequired: reward.pointsRequired,
        description: reward.description,
        createdAt: reward.createdAt,
      })
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