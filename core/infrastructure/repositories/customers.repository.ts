import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerTable } from '@/core/infrastructure/database/drizzle/types';
import { mapDbCustomerToDomain } from "@/core/infrastructure/mappers/customerMapper";
import { eq, like, SQL } from "drizzle-orm";

export class CustomerRepositoryDrizzle implements ICustomerRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable
  ) { }

  async create(customer: Customer): Promise<Customer> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(customer.toPersistence())
      .returning();

    return mapDbCustomerToDomain(inserted);
  }

  private async findByCondition(condition: SQL): Promise<Customer[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(condition);

    return result.map(mapDbCustomerToDomain);
  }

  async findById(id: number): Promise<Customer | null> {
    const [result] = await this.findByCondition(eq(this.table.id, id));
    return result || null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const [result] = await this.findByCondition(eq(this.table.phone, phone));
    return result || null;
  }

  async findByName(name: string): Promise<Customer[]> {
    return await this.findByCondition(like(this.table.name, `%${name}%`));
  }

  async findAll(): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table);

    return dbCustomers.map(mapDbCustomerToDomain);
  }

  async update(customer: Customer): Promise<Customer | null> {
    if (!customer.id) {
      throw new Error("Não é possível atualizar um cliente sem ID.");
    }

    const [updated] = await this.db
      .update(this.table)
      .set({
        name: customer.name,
        phone: customer.phone,
        points: customer.points,
        lastVisitAt: customer.lastVisitAt,
        createdAt: customer.createdAt,
      })
      .where(eq(this.table.id, customer.id))
      .returning();

    if (!updated) return null;

    return mapDbCustomerToDomain(updated);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    return (result.changes > 0);
  }
}