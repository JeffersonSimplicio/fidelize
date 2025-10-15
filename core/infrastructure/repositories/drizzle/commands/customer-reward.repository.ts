import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerRewardSelect, CustomerRewardTable } from "@/core/infrastructure/database/drizzle/types";
import { and, eq } from "drizzle-orm";

export interface CustomerRewardRepositoryDrizzleDep {
  dbClient: drizzleClient,
  customerRewardTable: CustomerRewardTable,
  customerRewardToDomainMapper: Mapper<CustomerRewardSelect, CustomerReward>,
}

export class CustomerRewardRepositoryDrizzle implements CustomerRewardRepository {
  private readonly dbClient: drizzleClient;
  private readonly customerRewardTable: CustomerRewardTable;
  private readonly customerRewardToDomainMapper: Mapper<
    CustomerRewardSelect,
    CustomerReward
  >;

  constructor(deps: CustomerRewardRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.customerRewardTable = deps.customerRewardTable;
    this.customerRewardToDomainMapper = deps.customerRewardToDomainMapper;
  }

  async create(customerReward: CustomerReward): Promise<CustomerReward> {
    const [inserted] = await this.dbClient
      .insert(this.customerRewardTable)
      .values(customerReward.toPersistence())
      .returning();

    return this.customerRewardToDomainMapper.map(inserted)
  }

  async getById(id: number): Promise<CustomerReward> {
    const result = this.dbClient
      .select()
      .from(this.customerRewardTable)
      .where(eq(this.customerRewardTable.id, id))
      .get();

    if (result) return this.customerRewardToDomainMapper.map(result);
    throw new Error("Resgate não encontrado")
  }

  async alreadyRedeemed(
    customerId: number,
    rewardId: number
  ): Promise<CustomerReward | null> {
    const result = this.dbClient
      .select()
      .from(this.customerRewardTable)
      .where(
        and(
          eq(this.customerRewardTable.customerId, customerId),
          eq(this.customerRewardTable.rewardId, rewardId)
        )
      )
      .get();

    return result ? this.customerRewardToDomainMapper.map(result) : null
  }

  async delete(id: number): Promise<void> {
    const result = await this.dbClient
      .delete(this.customerRewardTable)
      .where(eq(this.customerRewardTable.id, id));

    if (result.changes === 0) throw new Error("Resgate não encontrado");
  }
} 