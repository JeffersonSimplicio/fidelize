import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerTable } from '@/core/infrastructure/database/drizzle/types';
import { mapDbCustomerToDomain } from "@/core/infrastructure/mappers/customerMapper";
import { eq, like } from "drizzle-orm";


export class CustomerRepositoryDrizzle implements ICustomerRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable
  ) { }

  async create(data: Customer): Promise<Customer> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data.toPersistence())
      .returning();

    return mapDbCustomerToDomain(inserted);
  }

  private async findByField<T extends string | number>(
    field: keyof typeof this.table.$inferSelect,
    value: T
  ): Promise<Customer | null> {
    const [dbCustomer] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table[field], value));

    if (!dbCustomer) return null;
    return mapDbCustomerToDomain(dbCustomer);
  }

  async findById(id: number): Promise<Customer | null> {
    return this.findByField('id', id);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.findByField('phone', phone);
  }

  async findByName(name: string): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table)
      .where(like(this.table.name, `%${name}%`));

    return dbCustomers.map(mapDbCustomerToDomain);
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