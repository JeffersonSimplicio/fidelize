import { ListTopRewardsByRedeemUseCase } from '@/core/application/use-cases/customers-rewards';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { TopReward } from '@/core/domain/customer-rewards/query-models';
import { RewardDto } from '@/core/application/dtos/rewards';

describe('ListTopRewardsByRedeemUseCase', () => {
  let customerRewardQueryRepo: jest.Mocked<CustomerRewardQueryRepository>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;
  let useCase: ListTopRewardsByRedeemUseCase;

  beforeEach(() => {
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

    useCase = new ListTopRewardsByRedeemUseCase({
      customerRewardQueryRepo,
      rewardToDtoMapper,
    });
  });

  it('should return mapped top rewards (happy path)', async () => {
    const reward1 = new Reward({
      name: 'Reward1',
      description: 'Desc1',
      pointsRequired: 10,
      isActive: RewardStatus.Active,
    });
    reward1.setId(1);
    const reward2 = new Reward({
      name: 'Reward2',
      description: 'Desc2',
      pointsRequired: 20,
      isActive: RewardStatus.Active,
    });
    reward2.setId(2);

    const topReward1 = new TopReward(reward1, 5);
    const topReward2 = new TopReward(reward2, 3);

    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([
      topReward1,
      topReward2,
    ]);

    const dto1: RewardDto = {
      id: 1,
      name: 'Reward1',
      pointsRequired: 10,
      description: 'Desc1',
      isActive: true,
      createdAt: reward1.createdAt.toISOString(),
    };
    const dto2: RewardDto = {
      id: 2,
      name: 'Reward2',
      pointsRequired: 20,
      description: 'Desc2',
      isActive: true,
      createdAt: reward2.createdAt.toISOString(),
    };

    rewardToDtoMapper.map.mockImplementation((r) => (r.id === 1 ? dto1 : dto2));

    const result = await useCase.execute(2);

    expect(customerRewardQueryRepo.findTopRewardsByRedeem).toHaveBeenCalledWith(
      2,
    );
    expect(rewardToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { reward: dto1, redeemedCount: 5 },
      { reward: dto2, redeemedCount: 3 },
    ]);
  });

  it('should default limit to 3 if not provided', async () => {
    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([]);
    const result = await useCase.execute(undefined as any);
    expect(customerRewardQueryRepo.findTopRewardsByRedeem).toHaveBeenCalledWith(
      3,
    );
    expect(result).toEqual([]);
  });

  it('should use minimum limit of 1 if a non-positive limit is provided', async () => {
    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([]);
    await useCase.execute(0);
    expect(customerRewardQueryRepo.findTopRewardsByRedeem).toHaveBeenCalledWith(
      1,
    );
    await useCase.execute(-5);
    expect(customerRewardQueryRepo.findTopRewardsByRedeem).toHaveBeenCalledWith(
      1,
    );
  });

  it('should propagate error when findTopRewardsByRedeem throws', async () => {
    customerRewardQueryRepo.findTopRewardsByRedeem.mockRejectedValue(
      new Error('Query failed'),
    );
    await expect(useCase.execute(2)).rejects.toThrow('Query failed');
  });

  it('should propagate error when rewardToDtoMapper.map throws', async () => {
    const reward = new Reward({
      name: 'Fail',
      description: 'Fail',
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    reward.setId(10);

    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([
      new TopReward(reward, 7),
    ]);
    rewardToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapping failed');
    });

    await expect(useCase.execute(1)).rejects.toThrow('Mapping failed');
    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(reward);
  });

  it('should handle empty result gracefully', async () => {
    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([]);
    const result = await useCase.execute(5);
    expect(result).toEqual([]);
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should not call unrelated repository methods', async () => {
    const reward = new Reward({
      name: 'R',
      description: 'D',
      pointsRequired: 1,
    });
    reward.setId(1);
    customerRewardQueryRepo.findTopRewardsByRedeem.mockResolvedValue([
      new TopReward(reward, 2),
    ]);
    rewardToDtoMapper.map.mockReturnValue({
      id: 1,
      name: 'R',
      pointsRequired: 1,
      description: 'D',
      isActive: true,
      createdAt: reward.createdAt.toISOString(),
    });

    await useCase.execute(1);

    expect(customerRewardQueryRepo.findAll).not.toHaveBeenCalled();
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
