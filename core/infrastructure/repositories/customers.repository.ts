import { Customer, CustomerCreateProps, CustomerUpdateProps } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerTable, CustomerSelect } from '@/core/infrastructure/database/drizzle/types';
import { mapDbCustomerToDomain } from "@/core/infrastructure/mappers/customerMapper";
import { eq } from "drizzle-orm";


export class CustomerRepositoryDrizzle implements ICustomerRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable
  ) { }

  async create(data: CustomerCreateProps): Promise<Customer> {
    const [inserted] = await this.db
      .insert(this.table)
      .values(data)
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

  async findByName(name: string): Promise<Customer | null> {
    return this.findByField('name', name);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.findByField('phone', phone);
  }

  async findAll(): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table);

    return dbCustomers.map(mapDbCustomerToDomain);
  }

  async update(id: number, data: CustomerUpdateProps): Promise<Customer | null> {
    const updateData: Partial<CustomerSelect> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.points !== undefined) updateData.points = data.points;
    if (data.lastVisitAt !== undefined) updateData.lastVisitAt = data.lastVisitAt;

    if (Object.keys(updateData).length === 0) {
      return this.findById(id);
    }

    const [updatedCustomer ] = await this.db
      .update(this.table)
      .set(updateData)
      .where(eq(this.table.id, id))
      .returning();

    return mapDbCustomerToDomain(updatedCustomer );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id));

    return (result.changes > 0);
  }
}