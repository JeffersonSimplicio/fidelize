import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  RewardSelect,
  RewardTable,
  CustomerRewardTable
} from "@/core/infrastructure/database/drizzle/types";
import { eq, desc, sql } from "drizzle-orm";
import { TopReward } from "@/core/domain/customer-rewards/query-models"

export class CustomerRewardQueryRepositoryDrizzle implements CustomerRewardQueryRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly rewardTable: RewardTable,
    private readonly customerRewardTable: CustomerRewardTable,
    private readonly rewardMapper: Mapper<RewardSelect, Reward>,
  ) { }

  async findTopRewardsByRedeem(limit: number): Promise<TopReward[]> {
    const result = await this.db
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
        this.rewardMapper.map(item.reward),
        item.redeemedCount
      )
    );

    return mapped;
  }
}