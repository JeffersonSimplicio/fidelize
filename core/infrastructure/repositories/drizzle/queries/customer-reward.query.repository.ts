import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  RewardSelect,
  RewardTable,
  CustomerRewardSelect,
  CustomerRewardTable,
} from "@/core/infrastructure/database/drizzle/types";
import { eq, desc, sql } from "drizzle-orm";
import {
  TopReward,
  CustomerRedeemedReward,
} from "@/core/domain/customer-rewards/query-models"
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";

export interface CustomerRewardQueryRepositoryDrizzleDep {
  dbClient: drizzleClient,
  rewardTable: RewardTable,
  customerRewardTable: CustomerRewardTable,
  rewardToDomainMapper: Mapper<RewardSelect, Reward>,
  customerRewardToDomainMapper: Mapper<CustomerRewardSelect, CustomerReward>,
}

export class CustomerRewardQueryRepositoryDrizzle implements CustomerRewardQueryRepository {
  private readonly dbClient: drizzleClient;
  private readonly rewardTable: RewardTable;
  private readonly customerRewardTable: CustomerRewardTable;
  private readonly rewardToDomainMapper: Mapper<RewardSelect, Reward>;
  private readonly customerRewardToDomainMapper: Mapper<
    CustomerRewardSelect,
    CustomerReward
  >;

  constructor(deps: CustomerRewardQueryRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.rewardTable = deps.rewardTable;
    this.customerRewardTable = deps.customerRewardTable
    this.rewardToDomainMapper = deps.rewardToDomainMapper;
    this.customerRewardToDomainMapper = deps.customerRewardToDomainMapper;
  }

  async findAll(): Promise<CustomerReward[]> {
    const dbCustomerRewards = await this.dbClient
      .select()
      .from(this.customerRewardTable);

    return dbCustomerRewards.map(this.customerRewardToDomainMapper.map)
  }

  async findTopRewardsByRedeem(limit: number): Promise<TopReward[]> {
    const result = await this.dbClient
      .select({
        reward: this.rewardTable,
        redeemedCount: sql<number>`COUNT(${this.customerRewardTable.id})`,
      })
      .from(this.customerRewardTable)
      .innerJoin(
        this.rewardTable,
        eq(
          this.customerRewardTable.rewardId,
          this.rewardTable.id
        )
      )
      .groupBy(this.customerRewardTable.rewardId)
      .orderBy(desc(sql`COUNT(${this.customerRewardTable.id})`))
      .limit(limit);

    const mapped = result.map(item =>
      new TopReward(
        this.rewardToDomainMapper.map(item.reward),
        item.redeemedCount
      )
    );

    return mapped;
  }

  async findRewardsRedeemedByCustomer(
    customerId: number
  ): Promise<CustomerRedeemedReward[]> {
    const result = await this.dbClient
      .select({
        reward: this.rewardTable,
        redeemedAt: this.customerRewardTable.redeemedAt,
      })
      .from(this.customerRewardTable)
      .innerJoin(
        this.rewardTable,
        eq(
          this.rewardTable.id,
          this.customerRewardTable.rewardId
        )
      )
      .where(
        eq(
          this.customerRewardTable.customerId,
          customerId
        )
      )

    const mapped = result.map(item =>
      new CustomerRedeemedReward(
        this.rewardToDomainMapper.map(item.reward),
        item.redeemedAt
      )
    );

    return mapped;
  }
}