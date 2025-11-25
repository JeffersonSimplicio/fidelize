import { ListAvailableRewardsForCustomerUseCase } from "@/core/application/use-cases/customers-rewards";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { RewardDto } from "@/core/application/dtos";
import { Customer } from "@/core/domain/customers/customer.entity";

describe("ListAvailableRewardsForCustomerUseCase", () => {
  let customerRepo: jest.Mocked<CustomerRepository>;
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;
  let useCase: ListAvailableRewardsForCustomerUseCase;

  beforeEach(() => {
    customerRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      findByPhone: jest.fn(),
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

    rewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListAvailableRewardsForCustomerUseCase({
      customerRepo,
      customerRewardQueryRepo,
      rewardToDtoMapper,
    });
  });

  it("should return mapped reward DTOs for available rewards", async () => {
    const customer = new Customer({ name: "John", phone: "000", points: 100 });
    customer.setId(1);

    const r1 = new Reward({ name: "R1", description: "d1", pointsRequired: 10, isActive: RewardStatus.Active });
    r1.setId(10);
    const r2 = new Reward({ name: "R2", description: "d2", pointsRequired: 20, isActive: RewardStatus.Active });
    r2.setId(11);

    const dto1: RewardDto = {
      id: 10,
      name: "R1",
      pointsRequired: 10,
      description: "d1",
      isActive: true,
      createdAt: r1.createdAt.toISOString(),
    };
    const dto2: RewardDto = {
      id: 11,
      name: "R2",
      pointsRequired: 20,
      description: "d2",
      isActive: true,
      createdAt: r2.createdAt.toISOString(),
    };

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockResolvedValue([r1, r2]);
    rewardToDtoMapper.map.mockImplementation((r) => (r.id === 10 ? dto1 : dto2));

    const result = await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer).toHaveBeenCalledWith(customer.id);
    expect(rewardToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(1, r1);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(2, r2);
    expect(result).toEqual([dto1, dto2]);
  });

  it("should return an empty array when there are no available rewards", async () => {
    const customer = new Customer({ name: "John", phone: "000", points: 0 });
    customer.setId(2);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockResolvedValue([]);

    const result = await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer).toHaveBeenCalledWith(customer.id);
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should propagate error when customerRepo.getById throws", async () => {
    customerRepo.getById.mockRejectedValue(new Error("Customer read failure"));

    await expect(useCase.execute(123)).rejects.toThrow("Customer read failure");

    expect(customerRepo.getById).toHaveBeenCalledWith(123);
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer).not.toHaveBeenCalled();
  });

  it("should propagate error when findAvailableRewardsForCustomer throws", async () => {
    const customer = new Customer({ name: "X", phone: "x", points: 5 });
    customer.setId(3);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockRejectedValue(new Error("Query failure"));

    await expect(useCase.execute(customer.id!)).rejects.toThrow("Query failure");

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer).toHaveBeenCalledWith(customer.id);
  });

  it("should propagate error when mapper.map throws for an item", async () => {
    const customer = new Customer({ name: "Y", phone: "y", points: 50 });
    customer.setId(4);

    const r = new Reward({ name: "Bad", description: "bad", pointsRequired: 5, isActive: RewardStatus.Active });
    r.setId(20);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockResolvedValue([r]);
    rewardToDtoMapper.map.mockImplementation(() => { throw new Error("Mapping failed"); });

    await expect(useCase.execute(customer.id!)).rejects.toThrow("Mapping failed");

    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer).toHaveBeenCalledWith(customer.id);
    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(r);
  });

  it("should call getById before findAvailableRewardsForCustomer (order of operations)", async () => {
    const callOrder: string[] = [];
    const customer = new Customer({ name: "Z", phone: "z", points: 10 });
    customer.setId(5);

    customerRepo.getById.mockImplementation(async () => { callOrder.push("getById"); return customer; });
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockImplementation(async () => { callOrder.push("findAvailable"); return []; });

    await useCase.execute(customer.id!);

    expect(callOrder).toEqual(["getById", "findAvailable"]);
  });

  it("should not call unrelated repository methods", async () => {
    const customer = new Customer({ name: "U", phone: "u", points: 10 });
    customer.setId(6);

    const r = new Reward({ name: "Only", description: "only", pointsRequired: 1, isActive: RewardStatus.Active });
    r.setId(30);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findAvailableRewardsForCustomer.mockResolvedValue([r]);
    rewardToDtoMapper.map.mockReturnValue({
      id: 30,
      name: "Only",
      pointsRequired: 1,
      description: "only",
      isActive: true,
      createdAt: r.createdAt.toISOString(),
    });

    await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRepo.findByPhone).not.toHaveBeenCalled();
    expect(customerRepo.update).not.toHaveBeenCalled();
    expect(customerRewardQueryRepo.findAvailableRewardsForCustomer)
      .toHaveBeenCalledTimes(1);
    expect(customerRewardQueryRepo.findAll).not.toHaveBeenCalled();
    expect(customerRewardQueryRepo.findTopRewardsByRedeem).not.toHaveBeenCalled();
  });
});
