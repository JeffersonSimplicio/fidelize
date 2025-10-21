import { Customer } from "@/core/domain/customers/customer.entity";

export class CustomerRewardRedemption {
  constructor(
    public readonly customer: Customer,
    public readonly redeemedAt: Date,
  ) { }
}