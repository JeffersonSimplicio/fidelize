import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { Customer } from "@/core/domain/customers/customer.entity";
import { IListTopCustomersByPoints } from "@/core/application/interfaces/rewards";

export class ListTopCustomersByPointsUseCase implements IListTopCustomersByPoints {
  private static MIN_LIMIT = 1;

  constructor(
    private readonly repo: ICustomerRepository,
  ) { }

  async execute(limit: number): Promise<Customer[]> {
    const customerList = await this.repo.findAll();

    const sortedCustomers = [...customerList];
    sortedCustomers.sort((a, b) => b.points - a.points);

    const effectiveLimit = Math.max(limit, ListTopCustomersByPointsUseCase.MIN_LIMIT);

    return sortedCustomers.slice(0, effectiveLimit);
  }
}