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

  async findById(id: number): Promise<Customer | null> {
    const [dbCustomer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id));

    if (!dbCustomer) return null;

    return mapDbCustomerToDomain(dbCustomer);
  }

  async findAll(): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(customers);

    return dbCustomers.map(mapDbCustomerToDomain);
  }
}