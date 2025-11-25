import { RedeemRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { CreateCustomerRewardDto, CustomerRewardDto } from "@/core/application/dtos/customer-rewards";
import { InactiveRewardRedemptionError, InsufficientPointsError, RewardAlreadyRedeemedError } from "@/core/domain/customer-rewards/errors";

describe("RedeemRewardUseCase", () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let customerRepo: jest.Mocked<CustomerRepository>;
  let customerRewardRepo: jest.Mocked<CustomerRewardRepository>;
  let customerRewardToDtoMapper: jest.Mocked<Mapper<CustomerReward, CustomerRewardDto>>;
  let useCase: RedeemRewardUseCase;

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    customerRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    customerRewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      alreadyRedeemed: jest.fn(),
      delete: jest.fn(),
    };

    customerRewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new RedeemRewardUseCase({
      rewardRepo,
      customerRepo,
      customerRewardRepo,
      customerRewardToDtoMapper,
    });
  });

  it("should redeem a reward successfully (happy path)", async () => {
    const input: CreateCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const customer = new Customer({ name: "Alice", phone: "123", points: 100 });
    const reward = new Reward({ name: "Reward1", description: "Desc", pointsRequired: 50 });
    reward.setId(2);

    const customerReward = new CustomerReward({ customerId: 1, rewardId: 2 });
    customerReward.setId(99);

    const dto: CustomerRewardDto = {
      id: 99,
      customerId: 1,
      rewardId: 2,
      redeemedAt: customerReward.redeemedAt.toISOString(),
    };

    customerRepo.getById.mockResolvedValue(customer);
    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardRepo.alreadyRedeemed.mockResolvedValue(null);
    customerRewardRepo.create.mockResolvedValue(customerReward);
    customerRewardToDtoMapper.map.mockReturnValue(dto);

    const result = await useCase.execute(input);

    expect(customerRepo.getById).toHaveBeenCalledWith(1);
    expect(rewardRepo.getById).toHaveBeenCalledWith(2);
    expect(customerRewardRepo.alreadyRedeemed).toHaveBeenCalledWith(1, 2);
    expect(customerRewardRepo.create).toHaveBeenCalled();
    expect(customerRewardToDtoMapper.map).toHaveBeenCalledWith(customerReward);
    expect(result).toEqual(dto);
  });

  it("should throw InactiveRewardRedemptionError if reward is inactive", async () => {
    const input: CreateCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const customer = new Customer({ name: "Alice", phone: "123", points: 100 });
    const reward = new Reward({ name: "Reward1", description: "Desc", pointsRequired: 50, isActive: RewardStatus.Inactive });
    reward.setId(2);

    customerRepo.getById.mockResolvedValue(customer);
    rewardRepo.getById.mockResolvedValue(reward);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(InactiveRewardRedemptionError);
    expect(customerRewardRepo.alreadyRedeemed).not.toHaveBeenCalled();
  });

  it("should throw InsufficientPointsError if customer has not enough points", async () => {
    const input: CreateCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const customer = new Customer({ name: "Alice", phone: "123", points: 10 });
    const reward = new Reward({ name: "Reward1", description: "Desc", pointsRequired: 50 });
    reward.setId(2);

    customerRepo.getById.mockResolvedValue(customer);
    rewardRepo.getById.mockResolvedValue(reward);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(InsufficientPointsError);
    expect(customerRewardRepo.alreadyRedeemed).not.toHaveBeenCalled();
  });

  it("should throw RewardAlreadyRedeemedError if customer already redeemed the reward", async () => {
    const input: CreateCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const customer = new Customer({ name: "Alice", phone: "123", points: 100 });
    const reward = new Reward({ name: "Reward1", description: "Desc", pointsRequired: 50 });
    reward.setId(2);
    const existingCustomerReward = new CustomerReward({ customerId: 1, rewardId: 2 });

    customerRepo.getById.mockResolvedValue(customer);
    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardRepo.alreadyRedeemed.mockResolvedValue(existingCustomerReward);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(RewardAlreadyRedeemedError);
    expect(customerRewardRepo.create).not.toHaveBeenCalled();
  });

  it("should propagate repository or mapper errors", async () => {
    const input: CreateCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const customer = new Customer({ name: "Alice", phone: "123", points: 100 });
    const reward = new Reward({ name: "Reward1", description: "Desc", pointsRequired: 50 });
    reward.setId(2);

    customerRepo.getById.mockResolvedValue(customer);
    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardRepo.alreadyRedeemed.mockResolvedValue(null);
    customerRewardRepo.create.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute(input)).rejects.toThrow("DB error");

    const customerReward = new CustomerReward({ customerId: 1, rewardId: 2 });
    customerRewardRepo.create.mockResolvedValue(customerReward);
    customerRewardToDtoMapper.map.mockImplementation(() => { throw new Error("Mapping failed"); });

    await expect(useCase.execute(input)).rejects.toThrow("Mapping failed");
  });
});
