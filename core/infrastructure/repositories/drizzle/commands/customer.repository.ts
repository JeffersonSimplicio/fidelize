import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { drizzleClient } from "@/core/infrastructure/database/drizzle/db";
import {
  CustomerSelect,
  CustomerTable
} from '@/core/infrastructure/database/drizzle/types';
import { eq, SQL } from "drizzle-orm";

export interface CustomerRepositoryDrizzleDep {
  dbClient: drizzleClient,
  customerTable: CustomerTable,
  customerToDomainMapper: Mapper<CustomerSelect, Customer>,
}

export class CustomerRepositoryDrizzle implements CustomerRepository {
  private readonly dbClient: drizzleClient;
  private readonly customerTable: CustomerTable;
  private readonly customerToDomainMapper: Mapper<CustomerSelect, Customer>;

  constructor(deps: CustomerRepositoryDrizzleDep) {
    this.dbClient = deps.dbClient;
    this.customerTable = deps.customerTable;
    this.customerToDomainMapper = deps.customerToDomainMapper;
  }

  async create(customer: Customer): Promise<Customer> {
    const [inserted] = await this.dbClient
      .insert(this.customerTable)
      .values(customer.toPersistence())
      .returning();

    return this.customerToDomainMapper.map(inserted);
  }

  private async findOneByCondition(condition: SQL): Promise<Customer | null> {
    const result = this.dbClient
      .select()
      .from(this.customerTable)
      .where(condition)
      .limit(1)
      .get();

    return result ? this.customerToDomainMapper.map(result) : null;
  }

  async getById(id: number): Promise<Customer> {
    const result = await this.findOneByCondition(
      eq(this.customerTable.id, id)
    );
    if (result) return result;
    throw new Error("Cliente não encontrado")
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return await this.findOneByCondition(
      eq(this.customerTable.phone, phone)
    );
  }

  async update(customer: Customer): Promise<Customer> {
    if (!customer.id) {
      throw new Error("Não é possível atualizar um cliente sem ID.");
    }

    const { id, ...data } = customer.toPersistence();

    const [updated] = await this.dbClient
      .update(this.customerTable)
      .set(data)
      .where(
        eq(this.customerTable.id, customer.id)
      )
      .returning();

    return this.customerToDomainMapper.map(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.dbClient
      .delete(this.customerTable)
      .where(eq(this.customerTable.id, id));

    if (result.changes === 0) throw new Error("Cliente não encontrado");
  }
}