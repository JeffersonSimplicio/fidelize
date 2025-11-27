import { ListCustomerRewardsUseCase } from '@/core/application/use-cases/customers-rewards';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';
import { CustomerRewardDto } from '@/core/application/dtos/customer-rewards';

describe('ListCustomerRewardsUseCase', () => {
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let customerRewardToDtoMapper: jest.Mocked<
    Mapper<CustomerReward, CustomerRewardDto>
  >;
  let useCase: ListCustomerRewardsUseCase;

  beforeEach(() => {
    customerRewardQueryRepo = {
      findAll: jest.fn(),
      findTopRewardsByRedeem: jest.fn(),
      findRewardsRedeemedByCustomer: jest.fn(),
      findAvailableRewardsForCustomer: jest.fn(),
      findCustomersEligibleToRedeemReward: jest.fn(),
      findCustomersWhoRedeemedReward: jest.fn(),
    };

    customerRewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListCustomerRewardsUseCase({
      customerRewardQueryRepo,
      customerRewardToDtoMapper,
    });
  });

  it('should return mapped customer reward DTOs (happy path)', async () => {
    const cr1 = new CustomerReward({ customerId: 1, rewardId: 10 });
    cr1.setId(100);
    const cr2 = new CustomerReward({ customerId: 2, rewardId: 11 });
    cr2.setId(101);

    const dto1: CustomerRewardDto = {
      id: 100,
      customerId: 1,
      rewardId: 10,
      redeemedAt: cr1.redeemedAt.toISOString(),
    };
    const dto2: CustomerRewardDto = {
      id: 101,
      customerId: 2,
      rewardId: 11,
      redeemedAt: cr2.redeemedAt.toISOString(),
    };

    customerRewardQueryRepo.findAll.mockResolvedValue([cr1, cr2]);
    customerRewardToDtoMapper.map.mockImplementation((c) =>
      c.id === 100 ? dto1 : dto2,
    );

    const result = await useCase.execute();

    expect(customerRewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerRewardToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(customerRewardToDtoMapper.map).toHaveBeenNthCalledWith(1, cr1);
    expect(customerRewardToDtoMapper.map).toHaveBeenNthCalledWith(2, cr2);
    expect(result).toEqual([dto1, dto2]);
  });

  it('should return an empty array when repository returns no customer rewards', async () => {
    customerRewardQueryRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(customerRewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerRewardToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate error when repository.findAll throws', async () => {
    customerRewardQueryRepo.findAll.mockRejectedValue(
      new Error('DB read failed'),
    );

    await expect(useCase.execute()).rejects.toThrow('DB read failed');

    expect(customerRewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerRewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate error when mapper.map throws for an item', async () => {
    const cr = new CustomerReward({ customerId: 3, rewardId: 12 });
    cr.setId(102);

    customerRewardQueryRepo.findAll.mockResolvedValue([cr]);
    customerRewardToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapping failed');
    });

    await expect(useCase.execute()).rejects.toThrow('Mapping failed');

    expect(customerRewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(customerRewardToDtoMapper.map).toHaveBeenCalledWith(cr);
  });

  it('should preserve repository order in mapped results', async () => {
    const a = new CustomerReward({ customerId: 4, rewardId: 20 });
    a.setId(200);
    const b = new CustomerReward({ customerId: 5, rewardId: 21 });
    b.setId(201);

    customerRewardQueryRepo.findAll.mockResolvedValue([a, b]);

    const dtoA: CustomerRewardDto = {
      id: 200,
      customerId: 4,
      rewardId: 20,
      redeemedAt: a.redeemedAt.toISOString(),
    };
    const dtoB: CustomerRewardDto = {
      id: 201,
      customerId: 5,
      rewardId: 21,
      redeemedAt: b.redeemedAt.toISOString(),
    };

    customerRewardToDtoMapper.map.mockImplementation((c) =>
      c.id === 200 ? dtoA : dtoB,
    );

    const result = await useCase.execute();

    expect(result).toEqual([dtoA, dtoB]);
  });

  it('should only call findAll and not other query methods', async () => {
    const cr = new CustomerReward({ customerId: 6, rewardId: 30 });
    cr.setId(300);
    customerRewardQueryRepo.findAll.mockResolvedValue([cr]);
    customerRewardToDtoMapper.map.mockReturnValue({
      id: 300,
      customerId: 6,
      rewardId: 30,
      redeemedAt: cr.redeemedAt.toISOString(),
    });

    await useCase.execute();

    expect(customerRewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(
      customerRewardQueryRepo.findTopRewardsByRedeem,
    ).not.toHaveBeenCalled();
    expect(
      customerRewardQueryRepo.findRewardsRedeemedByCustomer,
    ).not.toHaveBeenCalled();
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
