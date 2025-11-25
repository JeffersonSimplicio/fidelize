import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerQueryRepository } from "@/core/domain/customers/customer.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  CustomerSelect,
  CustomerTable
} from '@/core/infrastructure/database/drizzle/types';
import { desc, like } from "drizzle-orm";

export interface CustomerQueryRepositoryDrizzleDep {
  dbClient: drizzleClient,
  customerTable: CustomerTable,
  customerToDomainMapper: Mapper<CustomerSelect, Customer>,
}

export class CustomerQueryRepositoryDrizzle implements CustomerQueryRepository {
  private readonly dbClient: drizzleClient;
  private readonly customerTable: CustomerTable;
  private readonly customerToDomainMapper: Mapper<CustomerSelect, Customer>;

  constructor(deps: CustomerQueryRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.customerTable = deps.customerTable;
    this.customerToDomainMapper = deps.customerToDomainMapper;
  }

  async findByName(name: string): Promise<Customer[]> {
    const dbCustomers = await this.dbClient
      .select()
      .from(this.customerTable)
      .where(like(this.customerTable.name, `%${name}%`));

    return dbCustomers.map(c => this.customerToDomainMapper.map(c));
  }

  async findAll(): Promise<Customer[]> {
    const dbCustomers = await this.dbClient
      .select()
      .from(this.customerTable);

    return dbCustomers.map(c => this.customerToDomainMapper.map(c));
  }

  async findTopCustomersByPoints(limit: number): Promise<Customer[]> {
    const dbCustomers = await this.dbClient
      .select()
      .from(this.customerTable)
      .orderBy(desc(this.customerTable.points))
      .limit(limit);

    return dbCustomers.map(c => this.customerToDomainMapper.map(c));
  }
}