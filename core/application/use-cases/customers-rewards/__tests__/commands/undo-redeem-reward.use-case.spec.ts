import { UndoRedeemRewardUseCase } from '@/core/application/use-cases/customers-rewards';
import { CustomerRewardRepository } from '@/core/domain/customer-rewards/customer-reward.repository.interface';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardStatus } from '@/core/domain/rewards/reward.status';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';
import { DeleteCustomerRewardDto } from '@/core/application/dtos/customer-rewards';
import {
  CustomerRewardNotFoundError,
  InactiveRewardRedemptionError,
} from '@/core/domain/customer-rewards/errors';

describe('UndoRedeemRewardUseCase', () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let customerRewardRepo: jest.Mocked<CustomerRewardRepository>;
  let useCase: UndoRedeemRewardUseCase;

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    customerRewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      alreadyRedeemed: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new UndoRedeemRewardUseCase({
      rewardRepo,
      customerRewardRepo,
    });
  });

  it('should undo a redeemed reward successfully (happy path)', async () => {
    const input: DeleteCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const redeemedReward = new CustomerReward({ customerId: 1, rewardId: 2 });
    redeemedReward.setId(99);

    const reward = new Reward({
      name: 'Reward1',
      description: 'Desc',
      pointsRequired: 50,
    });
    reward.setId(2);

    customerRewardRepo.alreadyRedeemed.mockResolvedValue(redeemedReward);
    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardRepo.delete.mockResolvedValue();

    await useCase.execute(input);

    expect(customerRewardRepo.alreadyRedeemed).toHaveBeenCalledWith(1, 2);
    expect(rewardRepo.getById).toHaveBeenCalledWith(2);
    expect(customerRewardRepo.delete).toHaveBeenCalledWith(99);
  });

  it('should throw CustomerRewardNotFoundError if the reward was not redeemed', async () => {
    const input: DeleteCustomerRewardDto = { customerId: 1, rewardId: 2 };

    customerRewardRepo.alreadyRedeemed.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      CustomerRewardNotFoundError,
    );
    expect(rewardRepo.getById).not.toHaveBeenCalled();
    expect(customerRewardRepo.delete).not.toHaveBeenCalled();
  });

  it('should throw InactiveRewardRedemptionError if reward is inactive', async () => {
    const input: DeleteCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const redeemedReward = new CustomerReward({ customerId: 1, rewardId: 2 });
    redeemedReward.setId(99);

    const reward = new Reward({
      name: 'Reward1',
      description: 'Desc',
      pointsRequired: 50,
      isActive: RewardStatus.Inactive,
    });
    reward.setId(2);

    customerRewardRepo.alreadyRedeemed.mockResolvedValue(redeemedReward);
    rewardRepo.getById.mockResolvedValue(reward);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InactiveRewardRedemptionError,
    );
    expect(customerRewardRepo.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const input: DeleteCustomerRewardDto = { customerId: 1, rewardId: 2 };
    const redeemedReward = new CustomerReward({ customerId: 1, rewardId: 2 });
    redeemedReward.setId(99);

    const reward = new Reward({
      name: 'Reward1',
      description: 'Desc',
      pointsRequired: 50,
    });
    reward.setId(2);

    customerRewardRepo.alreadyRedeemed.mockResolvedValue(redeemedReward);
    rewardRepo.getById.mockResolvedValue(reward);
    customerRewardRepo.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(useCase.execute(input)).rejects.toThrow('Delete failed');
  });
});
