import { ListRewardsRedeemedByCustomerUseCase } from '@/core/application/use-cases/customers-rewards';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerRedeemedReward } from '@/core/domain/customer-rewards/query-models';
import { RewardDto } from '@/core/application/dtos/rewards';

describe('ListRewardsRedeemedByCustomerUseCase', () => {
  let customerRepo: jest.Mocked<CustomerRepository>;
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;
  let useCase: ListRewardsRedeemedByCustomerUseCase;

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

    useCase = new ListRewardsRedeemedByCustomerUseCase({
      customerRepo,
      customerRewardQueryRepo,
      rewardToDtoMapper,
    });
  });

  it('should return mapped rewards redeemed by customer', async () => {
    const customer = new Customer({ name: 'Alice', phone: '111', points: 100 });
    customer.setId(1);

    const rewardA = new Reward({
      name: 'R-A',
      description: 'a',
      pointsRequired: 10,
      isActive: RewardStatus.Active,
    });
    rewardA.setId(10);
    const rewardB = new Reward({
      name: 'R-B',
      description: 'b',
      pointsRequired: 20,
      isActive: RewardStatus.Active,
    });
    rewardB.setId(11);

    const redeemedAtA = new Date('2024-01-01T00:00:00.000Z');
    const redeemedAtB = new Date('2024-02-01T00:00:00.000Z');

    const itemA = new CustomerRedeemedReward(rewardA, redeemedAtA);
    const itemB = new CustomerRedeemedReward(rewardB, redeemedAtB);

    const dtoA: RewardDto = {
      id: 10,
      name: 'R-A',
      pointsRequired: 10,
      description: 'a',
      isActive: true,
      createdAt: rewardA.createdAt.toISOString(),
    };
    const dtoB: RewardDto = {
      id: 11,
      name: 'R-B',
      pointsRequired: 20,
      description: 'b',
      isActive: true,
      createdAt: rewardB.createdAt.toISOString(),
    };

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockResolvedValue([
      itemA,
      itemB,
    ]);
    rewardToDtoMapper.map.mockImplementation((r) =>
      r.id === 10 ? dtoA : dtoB,
    );

    const result = await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).toHaveBeenCalledWith(customer.id);
    expect(rewardToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(1, rewardA);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(2, rewardB);
    expect(result).toEqual([
      { reward: dtoA, redeemedAt: redeemedAtA.toISOString() },
      { reward: dtoB, redeemedAt: redeemedAtB.toISOString() },
    ]);
  });

  it('should return an empty array when the customer redeemed no rewards', async () => {
    const customer = new Customer({ name: 'Bob', phone: '222', points: 0 });
    customer.setId(2);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockResolvedValue([]);

    const result = await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).toHaveBeenCalledWith(customer.id);
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate error when customerRepo.getById throws', async () => {
    customerRepo.getById.mockRejectedValue(new Error('Customer read failure'));

    await expect(useCase.execute(123)).rejects.toThrow('Customer read failure');

    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).not.toHaveBeenCalled();
  });

  it('should propagate error when findRewardsRedeemedByCustomer throws', async () => {
    const customer = new Customer({ name: 'C', phone: '333', points: 10 });
    customer.setId(3);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockRejectedValue(
      new Error('Query failure'),
    );

    await expect(useCase.execute(customer.id!)).rejects.toThrow(
      'Query failure',
    );

    expect(customerRepo.getById).toHaveBeenCalledWith(customer.id);
    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).toHaveBeenCalledWith(customer.id);
  });

  it('should propagate error when rewardToDtoMapper.map throws for an item', async () => {
    const customer = new Customer({ name: 'D', phone: '444', points: 10 });
    customer.setId(4);

    const reward = new Reward({
      name: 'Bad',
      description: 'bad',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(50);

    const redeemedAt = new Date();
    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockResolvedValue([
      new CustomerRedeemedReward(reward, redeemedAt),
    ]);
    rewardToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapping failed');
    });

    await expect(useCase.execute(customer.id!)).rejects.toThrow(
      'Mapping failed',
    );
    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(reward);
  });

  it('should call getById before findRewardsRedeemedByCustomer (order of operations)', async () => {
    const order: string[] = [];
    const customer = new Customer({ name: 'Order', phone: '9', points: 1 });
    customer.setId(5);

    customerRepo.getById.mockImplementation(async () => {
      order.push('getById');
      return customer;
    });
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockImplementation(
      async () => {
        order.push('findRedeemed');
        return [];
      },
    );

    await useCase.execute(customer.id!);

    expect(order).toEqual(['getById', 'findRedeemed']);
  });

  it('should not call unrelated repository methods', async () => {
    const customer = new Customer({ name: 'E', phone: '555', points: 5 });
    customer.setId(6);

    const reward = new Reward({
      name: 'Only',
      description: 'o',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(60);

    customerRepo.getById.mockResolvedValue(customer);
    customerRewardQueryRepo.findRewardsRedeemedByCustomer.mockResolvedValue([
      new CustomerRedeemedReward(reward, new Date()),
    ]);
    rewardToDtoMapper.map.mockReturnValue({
      id: 60,
      name: 'Only',
      pointsRequired: 1,
      description: 'o',
      isActive: true,
      createdAt: reward.createdAt.toISOString(),
    });

    await useCase.execute(customer.id!);

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).toHaveBeenCalledTimes(1);

    expect(customerRewardQueryRepo.findAll).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findAvailableRewardsForCustomer,
    ).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findCustomersEligibleToRedeemReward,
    ).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findCustomersWhoRedeemedReward,
    ).not.toHaveBeenCalled();
  });
});
