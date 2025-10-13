import { CustomerReward } from "@/core/domain/customer-reward/customer-reward.entity";
import { CustomerRewardRepository } from "@/core/domain/customer-reward/customer-reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerRewardsSelect, CustomerRewardsTable } from "@/core/infrastructure/database/drizzle/types";
import { and, eq } from "drizzle-orm";

export class CustomerRewardRepositoryDrizzle implements CustomerRewardRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerRewardsTable,
    private readonly mapper: Mapper<CustomerRewardsSelect, CustomerReward>,
  ) { }

  async create(customerReward: CustomerReward): Promise<CustomerReward> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(customerReward.toPersistence())
      .returning();

    return this.mapper.map(inserted)
  }

  async getById(id: number): Promise<CustomerReward> {
    const result = this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .get();

    if (result) return this.mapper.map(result);
    throw new Error("Resgate não encontrado")
  }

  async alreadyRedeemed(customerId: number, rewardId: number): Promise<boolean> {
    const result = this.db
      .select()
      .from(this.table)
      .where(
        and(
          eq(this.table.customerId, customerId),
          eq(this.table.rewardId, rewardId)
        )
      )
      .get();

    return result ? true : false
  }

  async delete(id: number): Promise<void> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    if (result.changes === 0) throw new Error("Resgate não encontrado");
  }
} 