import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  RewardSelect,
  RewardTable,
  CustomerSelect,
  CustomerTable,
  CustomerRewardSelect,
  CustomerRewardTable,
} from "@/core/infrastructure/database/drizzle/types";
import { eq, desc, sql, and, gte, isNull } from "drizzle-orm";
import {
  TopReward,
  CustomerRedeemedReward,
  CustomerRewardRedemption,
} from "@/core/domain/customer-rewards/query-models"
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

export interface CustomerRewardQueryRepositoryDrizzleDep {
  dbClient: drizzleClient,
  rewardTable: RewardTable,
  rewardToDomainMapper: Mapper<RewardSelect, Reward>,
  customerTable: CustomerTable
  customerToDomainMapper: Mapper<CustomerSelect, Customer>,
  customerRewardTable: CustomerRewardTable,
  customerRewardToDomainMapper: Mapper<CustomerRewardSelect, CustomerReward>,
}

export class CustomerRewardQueryRepositoryDrizzle implements CustomerRewardQueryRepository {
  private readonly dbClient: drizzleClient;
  private readonly rewardTable: RewardTable;
  private readonly rewardToDomainMapper: Mapper<RewardSelect, Reward>;
  private readonly customerTable: CustomerTable;
  private readonly customerToDomainMapper: Mapper<CustomerSelect, Customer>;
  private readonly customerRewardTable: CustomerRewardTable;
  private readonly customerRewardToDomainMapper: Mapper<
    CustomerRewardSelect,
    CustomerReward
  >;

  constructor(deps: CustomerRewardQueryRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.rewardTable = deps.rewardTable;
    this.rewardToDomainMapper = deps.rewardToDomainMapper;
    this.customerTable = deps.customerTable;
    this.customerToDomainMapper = deps.customerToDomainMapper;
    this.customerRewardTable = deps.customerRewardTable;
    this.customerRewardToDomainMapper = deps.customerRewardToDomainMapper;
  }

  async findAll(): Promise<CustomerReward[]> {
    const dbCustomerRewards = await this.dbClient
      .select()
      .from(this.customerRewardTable);

    return dbCustomerRewards.map(c => this.customerRewardToDomainMapper.map(c));
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

  async findAvailableRewardsForCustomer(customerId: number): Promise<Reward[]> {
    const result = await this.dbClient
      .select({
        id: this.rewardTable.id,
        name: this.rewardTable.name,
        pointsRequired: this.rewardTable.pointsRequired,
        description: this.rewardTable.description,
        isActive: this.rewardTable.isActive,
        createdAt: this.rewardTable.createdAt,
      })
      .from(this.rewardTable)
      .innerJoin(
        this.customerTable,
        gte(this.customerTable.points, this.rewardTable.pointsRequired)
      )
      .leftJoin(
        this.customerRewardTable,
        and(
          eq(this.customerRewardTable.rewardId, this.rewardTable.id),
          eq(this.customerRewardTable.customerId, customerId)
        )
      )
      .where(
        and(
          eq(this.customerTable.id, customerId),
          eq(this.rewardTable.isActive, RewardStatus.Active),
          isNull(this.customerRewardTable.id)
        )
      );

    return result.map(c => this.rewardToDomainMapper.map(c));
  }

  async findCustomersEligibleToRedeemReward(rewardId: number): Promise<Customer[]> {
    const result = await this.dbClient
      .select({
        id: this.customerTable.id,
        name: this.customerTable.name,
        phone: this.customerTable.phone,
        points: this.customerTable.points,
        lastVisitAt: this.customerTable.lastVisitAt,
        createdAt: this.customerTable.createdAt,
      })
      .from(this.rewardTable)
      .innerJoin(
        this.customerTable,
        gte(
          this.customerTable.points,
          this.rewardTable.pointsRequired
        )
      )
      .leftJoin(
        this.customerRewardTable,
        and(
          eq(this.customerRewardTable.customerId, this.customerTable.id),
          eq(this.customerRewardTable.rewardId, rewardId)
        )
      )
      .where(
        and(
          eq(this.rewardTable.id, rewardId),
          isNull(this.customerRewardTable.id)
        )
      );

    return result.map(c => this.customerToDomainMapper.map(c));
  }

  async findCustomersWhoRedeemedReward(
    rewardId: number
  ): Promise<CustomerRewardRedemption[]> {
    const result = await this.dbClient
      .select({
        customer: this.customerTable,
        redeemedAt: this.customerRewardTable.redeemedAt
      })
      .from(this.customerTable)
      .innerJoin(
        this.customerRewardTable,
        eq(
          this.customerRewardTable.customerId,
          this.customerTable.id
        )
      )
      .where(
        eq(
          this.customerRewardTable.rewardId,
          rewardId
        )
      )

    const mapped = result.map(item =>
      new CustomerRewardRedemption(
        this.customerToDomainMapper.map(item.customer),
        item.redeemedAt
      )
    );

    return mapped;
  }
}
