import { ListEligibleCustomersForRewardUseCase } from "@/core/application/use-cases/customers-rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer } from "@/core/domain/customers/customer.entity";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { CustomerDto } from "@/core/application/dtos/customers";

describe("ListEligibleCustomersForRewardUseCase", () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;
  let useCase: ListEligibleCustomersForRewardUseCase;

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    customerRewardQueryRepo = {
      findAll: jest.fn(),
      findTopRewardsByRedeem: jest.fn(),
      findRewardsRedeemedByCustomer: jest.fn(),
      findAvailableRewardsForCustomer: jest.fn(),
      findCustomersEligibleToRedeemReward: jest.fn(),
      findCustomersWhoRedeemedReward: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListEligibleCustomersForRewardUseCase({
      rewardRepo,
      customerRewardQueryRepo,
      customerToDtoMapper,
    });
  });

  it("should return a list of mapped CustomerDto when eligible customers exist (happy path)", async () => {
    const reward = new Reward({ name: "Big Prize", description: "desc", pointsRequired: 10, isActive: RewardStatus.Active });
    reward.setId(42);

    const c1 = new Customer({ name: "Alice", phone: "111", points: 50 });
    c1.setId(1);
    const c2 = new Customer({ name: "Bob", phone: "222", points: 60 });
    c2.setId(2);

    const dto1: CustomerDto = {
      id: 1,
      name: "Alice",
      phone: "111",
      points: 50,
      createdAt: c1.createdAt.toISOString(),
      lastVisitAt: c1.lastVisitAt.toISOString(),
    };
    const dto2: CustomerDto = {
      id: 2,
      name: "Bob",
      phone: "222",
      points: 60,
      createdAt: c2.createdAt.toISOString(),
      lastVisitAt: c2.lastVisitAt.toISOString(),
    };

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockResolvedValue([c1, c2]);
    customerToDtoMapper.map.mockImplementation(c => (c.id === 1 ? dto1 : dto2));

    const result = await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).toHaveBeenCalledWith(reward.id);
    expect(customerToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(1, c1);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(2, c2);
    expect(result).toEqual([dto1, dto2]);
  });

  it("should return an empty array when repository returns no eligible customers", async () => {
    const reward = new Reward({ name: "Small Prize", description: "desc", pointsRequired: 1, isActive: RewardStatus.Active });
    reward.setId(99);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockResolvedValue([]);

    const result = await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).toHaveBeenCalledWith(reward.id);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should propagate error when rewardRepo.getById throws", async () => {
    rewardRepo.getById.mockRejectedValue(new Error("Reward read failed"));

    await expect(useCase.execute(123)).rejects.toThrow("Reward read failed");

    expect(rewardRepo.getById).toHaveBeenCalledWith(123);
    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).not.toHaveBeenCalled();
  });

  it("should propagate error when findCustomersEligibleToRedeemReward throws", async () => {
    const reward = new Reward({ name: "Some", description: "d", pointsRequired: 1, isActive: RewardStatus.Active });
    reward.setId(7);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockRejectedValue(new Error("Query failure"));

    await expect(useCase.execute(reward.id!)).rejects.toThrow("Query failure");

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).toHaveBeenCalledWith(reward.id);
  });

  it("should propagate error when mapper.map throws for an item", async () => {
    const reward = new Reward({ name: "X", description: "x", pointsRequired: 1, isActive: RewardStatus.Active });
    reward.setId(5);

    const c = new Customer({ name: "Charles", phone: "333", points: 20 });
    c.setId(6);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockResolvedValue([c]);
    customerToDtoMapper.map.mockImplementation(() => { throw new Error("Mapping failed"); });

    await expect(useCase.execute(reward.id!)).rejects.toThrow("Mapping failed");

    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).toHaveBeenCalledWith(reward.id);
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(c);
  });

  it("should call getById before findCustomersEligibleToRedeemReward (order of operations)", async () => {
    const order: string[] = [];
    const reward = new Reward({ name: "Order", description: "o", pointsRequired: 1, isActive: RewardStatus.Active });
    reward.setId(12);

    rewardRepo.getById.mockImplementation(async () => { order.push("getById"); return reward; });
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockImplementation(async () => { order.push("findEligible"); return []; });

    await useCase.execute(reward.id!);

    expect(order).toEqual(["getById", "findEligible"]);
  });

  it("should not call unrelated repository methods", async () => {
    const reward = new Reward({ name: "NoExtra", description: "n", pointsRequired: 1, isActive: RewardStatus.Active });
    reward.setId(21);

    const c = new Customer({ name: "Only", phone: "9", points: 9 });
    c.setId(33);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersEligibleToRedeemReward.mockResolvedValue([c]);
    customerToDtoMapper.map.mockReturnValue({
      id: 33,
      name: "Only",
      phone: "9",
      points: 9,
      createdAt: c.createdAt.toISOString(),
      lastVisitAt: c.lastVisitAt.toISOString(),
    });

    await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRewardQueryRepo.findCustomersEligibleToRedeemReward).toHaveBeenCalledTimes(1);

    expect(customerRewardQueryRepo.findAll).not.toHaveBeenCalled();
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer)
      .not.toHaveBeenCalled();
    expect(customerRewardQueryRepo.findTopRewardsByRedeem).not.toHaveBeenCalled();
    expect(customerRewardQueryRepo.findCustomersWhoRedeemedReward).not.toHaveBeenCalled();
  });
});
