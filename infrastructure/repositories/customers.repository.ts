import { ICustomerRepository } from "@/domain/customers/customer.repository";
import { CreateCustomerDto } from "@/domain/customers/dtos/create-customer.dto";
import { Customer } from "@/domain/customers/customer.entity";
import { eq } from "drizzle-orm";
import { mapDbCustomerToDomain } from "@/infrastructure/mappers/customerMapper";
import { drizzleClient } from "@/infrastructure/database/drizzle/db";
import { CustomerTable } from '@/infrastructure/database/drizzle/types';


export class CustomerRepositoryDrizzle implements ICustomerRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable
  ) { }

  async create(data: CreateCustomerDto): Promise<Customer> {
    const now = new Date();

    const [inserted] = await this.db
      .insert(this.table)
      .values({
        name: data.name,
        phone: data.phone,
        points: 0,
        lastVisitAt: now,
        createdAt: now,
      })
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