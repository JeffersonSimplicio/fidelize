import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  RewardSelect,
  RewardTable
} from "@/core/infrastructure/database/drizzle/types";
import { eq } from "drizzle-orm";
import { RewardNotFoundError } from "@/core/domain/rewards/errors"

export interface RewardRepositoryDrizzleDep {
  dbClient: drizzleClient,
  rewardTable: RewardTable,
  rewardToDomainMapper: Mapper<RewardSelect, Reward>,
}


export class RewardRepositoryDrizzle implements RewardRepository {
  private readonly dbClient: drizzleClient;
  private readonly rewardTable: RewardTable;
  private readonly rewardToDomainMapper: Mapper<RewardSelect, Reward>;

  constructor(deps: RewardRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.rewardTable = deps.rewardTable;
    this.rewardToDomainMapper = deps.rewardToDomainMapper;
  }

  async create(reward: Reward): Promise<Reward> {
    const [inserted] = await this.dbClient
      .insert(this.rewardTable)
      .values(reward.toPersistence())
      .returning();

    return this.rewardToDomainMapper.map(inserted);
  }

  async getById(id: number): Promise<Reward> {
    const result = this.dbClient
      .select()
      .from(this.rewardTable)
      .where(eq(this.rewardTable.id, id))
      .get();

    if (result) return this.rewardToDomainMapper.map(result);
    throw new RewardNotFoundError()
  }

  async update(reward: Reward): Promise<Reward> {
    const { id, ...data } = reward.toPersistence();

    const [updated] = await this.dbClient
      .update(this.rewardTable)
      .set(data)
      .where(eq(this.rewardTable.id, reward.id!))
      .returning();

    return this.rewardToDomainMapper.map(updated);
  }

  async delete(id: number): Promise<void> {
    await this.dbClient
      .delete(this.rewardTable)
      .where(eq(this.rewardTable.id, id));
  }
}