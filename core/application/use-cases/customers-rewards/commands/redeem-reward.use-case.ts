import { CreateCustomerRewardDto, CustomerRewardDto } from "@/core/application/dtos/customer-rewards";
import { RedeemReward } from "@/core/application/interfaces/customers-rewards";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { InactiveRewardRedemptionError, InsufficientPointsError, RewardAlreadyRedeemedError } from "@/core/domain/customer-rewards/errors";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export interface RedeemRewardDep {
  rewardRepo: RewardRepository,
  customerRepo: CustomerRepository,
  customerRewardRepo: CustomerRewardRepository,
  customerRewardToDtoMapper: Mapper<CustomerReward, CustomerRewardDto>,
}

export class RedeemRewardUseCase implements RedeemReward {
  private readonly rewardRepo: RewardRepository;
  private readonly customerRepo: CustomerRepository;
  private readonly customerRewardRepo: CustomerRewardRepository;
  private readonly customerRewardToDtoMapper: Mapper<
    CustomerReward,
    CustomerRewardDto
  >;

  constructor(deps: RedeemRewardDep) {
    this.rewardRepo = deps.rewardRepo;
    this.customerRepo = deps.customerRepo;
    this.customerRewardRepo = deps.customerRewardRepo;
    this.customerRewardToDtoMapper = deps.customerRewardToDtoMapper
  }

  async execute({
    customerId,
    rewardId
  }: CreateCustomerRewardDto): Promise<CustomerRewardDto> {
    const customer = await this.customerRepo.getById(customerId);

    const reward = await this.rewardRepo.getById(rewardId);

    if (reward.isActive === RewardStatus.Inactive) {
      throw new InactiveRewardRedemptionError();
    }

    if (customer.points < reward.pointsRequired) {
      throw new InsufficientPointsError(customer.name, reward.name)
    }

    const hasAlreadyRedeemed = await this.customerRewardRepo.alreadyRedeemed(
      customerId,
      rewardId
    );

    if (hasAlreadyRedeemed) {
      throw new RewardAlreadyRedeemedError(customer.name, reward.name);
    }

    const newCustomerReward = new CustomerReward({ customerId, rewardId });

    const customerReward = await this.customerRewardRepo.create(newCustomerReward);

    return this.customerRewardToDtoMapper.map(customerReward);
  }
}