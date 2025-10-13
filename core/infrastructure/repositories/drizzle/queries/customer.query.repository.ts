import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  CustomerSelect,
  CustomerTable
} from '@/core/infrastructure/database/drizzle/types';
import { like } from "drizzle-orm";

export class CustomerQueryRepositoryDrizzle implements CustomerQueryRepository {
  constructor(
    private readonly db: drizzleClient,
    private readonly table: CustomerTable,
    private readonly mapper: Mapper<CustomerSelect, Customer>,
  ) { }

  async findByName(name: string): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table)
      .where(like(this.table.name, `%${name}%`));

    return dbCustomers.map(this.mapper.map);
  }

  async findAll(): Promise<Customer[]> {
    const dbCustomers = await this.db
      .select()
      .from(this.table);

    return dbCustomers.map(this.mapper.map);
  }
}