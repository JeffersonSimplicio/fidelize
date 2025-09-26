import { drizzleClient } from "@/database/db";
import { customers } from '@/database/schema'
import { Customer } from "@/domain/customers/customer.entity";
import { ICustomerRepository } from "@/domain/customers/customer.repository";
import { CreateCustomerDto } from "@/domain/customers/dtos/create-customer.dto";
import { mapDbCustomerToDomain } from "@/repositories/mappers/customerMapper";
import { eq } from "drizzle-orm";


export class CustomerRepositoryDrizzle implements ICustomerRepository {
  constructor(private readonly db: drizzleClient) { }

  async create(data: CreateCustomerDto): Promise<Customer> {
    const now = new Date();

    const [inserted] = await this.db
      .insert(customers)
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
    field: keyof typeof customers.$inferSelect,
    value: T
  ): Promise<Customer | null> {
    const [dbCustomer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers[field], value));

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
      .from(customers);

    return dbCustomers.map(mapDbCustomerToDomain);
  }
}