import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerRewardsTable } from '@/core/infrastructure/database/drizzle/types';
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";
import { mapDbCustomerRewardToDomain } from "@/core/infrastructure/mappers/customerRewardMapper";
import { eq, SQL } from "drizzle-orm";

export class CustomerRewardRepositoryDrizzle implements ICustomerRewardRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerRewardsTable
  ) { }

  async create(customerReward: CustomerReward): Promise<CustomerReward> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(customerReward.toPersistence())
      .returning();

    return mapDbCustomerRewardToDomain(inserted);
  }

  private async findByCondition(condition: SQL): Promise<CustomerReward[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(condition);

    return result.map(mapDbCustomerRewardToDomain);
  }

  async findById(id: number): Promise<CustomerReward | null> {
    const [result] = await this.findByCondition(eq(this.table.id, id));
    return result || null;
  }

  async findByCustomerId(customerId: number): Promise<CustomerReward[]> {
    return await this.findByCondition(eq(this.table.customerId, customerId));
  }

  async findByRewardId(rewardId: number): Promise<CustomerReward[]> {
    return await this.findByCondition(eq(this.table.rewardId, rewardId));
  }

  async findAll(): Promise<CustomerReward[]> {
    const result = await this.db
      .select()
      .from(this.table);

    return result.map(mapDbCustomerRewardToDomain);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    return (result.changes > 0);
  }
}