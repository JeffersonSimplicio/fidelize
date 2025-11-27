import { RegisterRewardUseCase } from '@/core/application/use-cases/rewards';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';
import { Validation } from '@/core/domain/validation/validation.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CreateRewardDto, RewardDto } from '@/core/application/dtos/rewards';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { ValidationException } from '@/core/domain/shared/errors/validation-exception.error';
import { RewardStatus } from '@/core/domain/rewards/reward.status';

describe('RegisterRewardUseCase', () => {
  let useCase: RegisterRewardUseCase;
  let rewardRepo: jest.Mocked<RewardRepository>;
  let createRewardValidator: jest.Mocked<Validation<CreateRewardDto>>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;

  const validInput: CreateRewardDto = {
    name: 'Free Coffee',
    description: 'One free coffee at partner shops',
    pointsRequired: 100,
  };

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    createRewardValidator = {
      validate: jest.fn(),
    };

    rewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new RegisterRewardUseCase({
      rewardRepo,
      createRewardValidator,
      rewardToDtoMapper,
    });
  });

  it('should throw ValidationException when validator returns errors', async () => {
    createRewardValidator.validate.mockReturnValue([
      {
        field: 'pointsRequired',
        message: 'Points required must be at least 1',
      },
    ]);

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(
      ValidationException,
    );

    expect(createRewardValidator.validate).toHaveBeenCalledWith(validInput);
    expect(rewardRepo.create).not.toHaveBeenCalled();
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should create a Reward and return mapped DTO (happy path)', async () => {
    createRewardValidator.validate.mockReturnValue([]);

    const createdReward = new Reward({
      name: validInput.name,
      pointsRequired: validInput.pointsRequired,
      description: validInput.description,
    });
    createdReward.setId(7);

    const expectedDto: RewardDto = {
      id: 7,
      name: validInput.name,
      pointsRequired: validInput.pointsRequired,
      description: validInput.description,
      isActive: createdReward.isActive === RewardStatus.Active,
      createdAt: createdReward.createdAt.toISOString(),
    };

    rewardRepo.create.mockResolvedValue(createdReward);
    rewardToDtoMapper.map.mockReturnValue(expectedDto);

    const result = await useCase.execute(validInput);

    expect(createRewardValidator.validate).toHaveBeenCalledWith(validInput);

    expect(rewardRepo.create).toHaveBeenCalledTimes(1);
    const passedReward = rewardRepo.create.mock.calls[0][0] as Reward;
    expect(passedReward).toBeInstanceOf(Reward);
    expect(passedReward.name).toBe(validInput.name);
    expect(passedReward.description).toBe(validInput.description);
    expect(passedReward.pointsRequired).toBe(validInput.pointsRequired);
    expect(passedReward.isActive).toBe(RewardStatus.Active);
    expect(passedReward.createdAt).toBeInstanceOf(Date);

    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(createdReward);
    expect(result).toEqual(expectedDto);
  });

  it('should propagate error when repository.create throws', async () => {
    createRewardValidator.validate.mockReturnValue([]);
    rewardRepo.create.mockRejectedValue(new Error('DB create failed'));

    await expect(useCase.execute(validInput)).rejects.toThrow(
      'DB create failed',
    );

    expect(createRewardValidator.validate).toHaveBeenCalledWith(validInput);
    expect(rewardRepo.create).toHaveBeenCalled();
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate error when mapper.map throws', async () => {
    createRewardValidator.validate.mockReturnValue([]);

    const createdReward = new Reward({
      name: validInput.name,
      pointsRequired: validInput.pointsRequired,
      description: validInput.description,
    });
    createdReward.setId(3);

    rewardRepo.create.mockResolvedValue(createdReward);
    rewardToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapper failure');
    });

    await expect(useCase.execute(validInput)).rejects.toThrow('Mapper failure');

    expect(rewardRepo.create).toHaveBeenCalled();
    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(createdReward);
  });
});
