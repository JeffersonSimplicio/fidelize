import { ListCustomersWhoRedeemedRewardUseCase } from '@/core/application/use-cases/customers-rewards';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { CustomerRewardRedemption } from '@/core/domain/customer-rewards/query-models';
import { CustomerDto } from '@/core/application/dtos/customers';
import { CustomerRewardRedemptionDto } from '@/core/application/dtos/customer-rewards';

describe('ListCustomersWhoRedeemedRewardUseCase', () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let customerDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;
  let useCase: ListCustomersWhoRedeemedRewardUseCase;

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

    customerDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListCustomersWhoRedeemedRewardUseCase({
      rewardRepo,
      customerRewardQueryRepo,
      customerDtoMapper,
    });
  });

  it('should return mapped CustomerRewardRedemptionDto array (happy path)', async () => {
    const reward = new Reward({
      name: 'Prize',
      description: 'd',
      pointsRequired: 5,
      isActive: RewardStatus.Active,
    });
    reward.setId(7);

    const cust1 = new Customer({ name: 'Alice', phone: '111', points: 100 });
    cust1.setId(1);
    const cust2 = new Customer({ name: 'Bob', phone: '222', points: 200 });
    cust2.setId(2);

    const redeemedAt1 = new Date('2024-01-01T10:00:00.000Z');
    const redeemedAt2 = new Date('2024-01-02T11:00:00.000Z');

    const item1 = new CustomerRewardRedemption(cust1, redeemedAt1);
    const item2 = new CustomerRewardRedemption(cust2, redeemedAt2);

    const dto1: CustomerDto = {
      id: 1,
      name: 'Alice',
      phone: '111',
      points: 100,
      createdAt: cust1.createdAt.toISOString(),
      lastVisitAt: cust1.lastVisitAt.toISOString(),
    };
    const dto2: CustomerDto = {
      id: 2,
      name: 'Bob',
      phone: '222',
      points: 200,
      createdAt: cust2.createdAt.toISOString(),
      lastVisitAt: cust2.lastVisitAt.toISOString(),
    };

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockResolvedValue([
      item1,
      item2,
    ]);
    customerDtoMapper.map.mockImplementation((c) => (c.id === 1 ? dto1 : dto2));

    const result = await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
    expect(
      customerRewardQueryRepo.findCustomersWhoRedeemedReward,
    ).toHaveBeenCalledWith(reward.id);
    expect(customerDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(customerDtoMapper.map).toHaveBeenNthCalledWith(1, cust1);
    expect(customerDtoMapper.map).toHaveBeenNthCalledWith(2, cust2);

    expect(result).toEqual<CustomerRewardRedemptionDto[]>([
      { customer: dto1, redeemedAt: redeemedAt1.toISOString() },
      { customer: dto2, redeemedAt: redeemedAt2.toISOString() },
    ]);
  });

  it('should return an empty array when no customers redeemed the reward', async () => {
    const reward = new Reward({
      name: 'None',
      description: 'd',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(8);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockResolvedValue(
      [],
    );

    const result = await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
    expect(
      customerRewardQueryRepo.findCustomersWhoRedeemedReward,
    ).toHaveBeenCalledWith(reward.id);
    expect(customerDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate error when rewardRepo.getById throws', async () => {
    rewardRepo.getById.mockRejectedValue(new Error('DB read error'));

    await expect(useCase.execute(123)).rejects.toThrow('DB read error');

    expect(
      customerRewardQueryRepo.findCustomersWhoRedeemedReward,
    ).not.toHaveBeenCalled();
    expect(customerDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate error when findCustomersWhoRedeemedReward throws', async () => {
    const reward = new Reward({
      name: 'Err',
      description: 'd',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(9);

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockRejectedValue(
      new Error('Query failed'),
    );

    await expect(useCase.execute(reward.id!)).rejects.toThrow('Query failed');

    expect(rewardRepo.getById).toHaveBeenCalledWith(reward.id);
  });

  it('should propagate error when customerDtoMapper.map throws for an item', async () => {
    const reward = new Reward({
      name: 'MapErr',
      description: 'd',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(10);

    const cust = new Customer({ name: 'X', phone: 'x', points: 10 });
    cust.setId(5);
    const redeemedAt = new Date();

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockResolvedValue([
      new CustomerRewardRedemption(cust, redeemedAt),
    ]);
    customerDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapping failed');
    });

    await expect(useCase.execute(reward.id!)).rejects.toThrow('Mapping failed');
    expect(customerDtoMapper.map).toHaveBeenCalledWith(cust);
  });

  it('should call getById before findCustomersWhoRedeemedReward (order of operations)', async () => {
    const order: string[] = [];
    const reward = new Reward({
      name: 'OrderTest',
      description: 'd',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(11);

    rewardRepo.getById.mockImplementation(async () => {
      order.push('getById');
      return reward;
    });
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockImplementation(
      async () => {
        order.push('findWhoRedeemed');
        return [];
      },
    );

    await useCase.execute(reward.id!);

    expect(order).toEqual(['getById', 'findWhoRedeemed']);
  });

  it('should not call unrelated repository methods', async () => {
    const reward = new Reward({
      name: 'NoExtra',
      description: 'd',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(12);

    const cust = new Customer({ name: 'Only', phone: '9', points: 9 });
    cust.setId(33);
    const redeemedAt = new Date();

    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardQueryRepo.findCustomersWhoRedeemedReward.mockResolvedValue([
      new CustomerRewardRedemption(cust, redeemedAt),
    ]);
    customerDtoMapper.map.mockReturnValue({
      id: 33,
      name: 'Only',
      phone: '9',
      points: 9,
      createdAt: cust.createdAt.toISOString(),
      lastVisitAt: cust.lastVisitAt.toISOString(),
    });

    await useCase.execute(reward.id!);

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(
      customerRewardQueryRepo.findCustomersWhoRedeemedReward,
    ).toHaveBeenCalledTimes(1);

    expect(customerRewardQueryRepo.findAll).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findAvailableRewardsForCustomer,
    ).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findCustomersEligibleToRedeemReward,
    ).not.toHaveBeenCalled();
  });
});
