import { CustomerDto } from "@/core/application/dtos/customers"

export type CustomerRewardRedemptionDto = {
  customer: CustomerDto;
  redeemedAt: string;
}