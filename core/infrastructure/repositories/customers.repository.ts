import { Customer, CustomerCreateProps } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import { CustomerTable } from '@/core/infrastructure/database/drizzle/types';
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
}