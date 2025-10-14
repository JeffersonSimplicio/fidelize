import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  CustomerSelect,
  CustomerTable
} from '@/core/infrastructure/database/drizzle/types';
import { eq, SQL } from "drizzle-orm";

export class CustomerRepositoryDrizzle implements CustomerRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable,
    private readonly mapper: Mapper<CustomerSelect, Customer>,
  ) { }

  async create(customer: Customer): Promise<Customer> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(customer.toPersistence())
      .returning();

    return this.mapper.map(inserted);
  }

  private async findOneByCondition(condition: SQL): Promise<Customer | null> {
    const result = this.db
      .select()
      .from(this.table)
      .where(condition)
      .limit(1)
      .get();

    return result ? this.mapper.map(result) : null;
  }

  async getById(id: number): Promise<Customer> {
    const result = await this.findOneByCondition(eq(this.table.id, id));
    if (result) return result;
    throw new Error("Cliente não encontrado")
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return await this.findOneByCondition(eq(this.table.phone, phone));
  }

  async update(customer: Customer): Promise<Customer> {
    if (!customer.id) {
      throw new Error("Não é possível atualizar um cliente sem ID.");
    }

    const { id, ...data } = customer.toPersistence();

    const [updated] = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, customer.id))
      .returning();

    return this.mapper.map(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    if (result.changes === 0) throw new Error("Cliente não encontrado");
  }
}