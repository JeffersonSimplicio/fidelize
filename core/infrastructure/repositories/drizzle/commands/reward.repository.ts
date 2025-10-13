import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  RewardSelect,
  RewardTable
} from "@/core/infrastructure/database/drizzle/types";
import { eq } from "drizzle-orm";

export class RewardRepositoryDrizzle implements RewardRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: RewardTable,
    private readonly mapper: Mapper<RewardSelect, Reward>,
  ) { }

  async create(reward: Reward): Promise<Reward> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(reward.toPersistence())
      .returning();

    return this.mapper.map(inserted);
  }

  async getById(id: number): Promise<Reward> {
    const result = this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .get();

    if (result) return this.mapper.map(result);
    throw new Error("Recompensa não encontrado")
  }

  async update(reward: Reward): Promise<Reward> {
    if (!reward.id) {
      throw new Error("Não é possível atualizar uma recompensa sem ID.");
    }

    const { id, ...data } = reward.toPersistence();

    const [updated] = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, reward.id))
      .returning();

    return this.mapper.map(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    if (result.changes === 0) throw new Error("Recompensa não encontrada");
  }
}