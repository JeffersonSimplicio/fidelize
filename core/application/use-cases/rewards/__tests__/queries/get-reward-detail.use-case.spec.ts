import { GetRewardDetailUseCase } from "@/core/application/use-cases/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardDto } from "@/core/application/dtos/rewards";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

describe("GetRewardDetailUseCase", () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let mapper: jest.Mocked<Mapper<Reward, RewardDto>>;
  let useCase: GetRewardDetailUseCase;

  beforeEach(() => {
    rewardRepo = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mapper = {
      map: jest.fn(),
    };

    useCase = new GetRewardDetailUseCase({
      rewardRepo,
      rewardToDtoMapper: mapper,
    });
  });

  it("should return reward detail DTO successfully", async () => {
    const reward = new Reward({
      name: "Free Coffee",
      description: "A simple reward",
      pointsRequired: 10,
      isActive: RewardStatus.Active,
      createdAt: new Date("2024-01-01"),
    });

    reward.setId(1);

    const dto: RewardDto = {
      id: 1,
      name: "Free Coffee",
      description: "A simple reward",
      pointsRequired: 10,
      isActive: true,
      createdAt: "2024-01-01",
    };

    rewardRepo.getById.mockResolvedValue(reward);
    mapper.map.mockReturnValue(dto);

    const result = await useCase.execute(1);

    expect(result).toEqual(dto);
    expect(rewardRepo.getById).toHaveBeenCalledWith(1);
    expect(mapper.map).toHaveBeenCalledWith(reward);
  });

  it("should throw if reward repository throws", async () => {
    rewardRepo.getById.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(1)).rejects.toThrow("Database error");
    expect(rewardRepo.getById).toHaveBeenCalledWith(1);
    expect(mapper.map).not.toHaveBeenCalled();
  });

  it("should throw if mapper throws", async () => {
    const reward = new Reward({
      name: "VIP Pass",
      description: "Exclusive reward",
      pointsRequired: 50,
    });

    reward.setId(10);

    rewardRepo.getById.mockResolvedValue(reward);
    mapper.map.mockImplementation(() => {
      throw new Error("Mapping failed");
    });

    await expect(useCase.execute(10)).rejects.toThrow("Mapping failed");

    expect(rewardRepo.getById).toHaveBeenCalledWith(10);
    expect(mapper.map).toHaveBeenCalledWith(reward);
  });

  it("should pass exactly the returned entity to the mapper", async () => {
    const reward = new Reward({
      name: "Gift Card",
      description: "Reward description",
      pointsRequired: 20,
    });

    reward.setId(5);

    rewardRepo.getById.mockResolvedValue(reward);
    mapper.map.mockReturnValue({
      id: 5,
      name: "Gift Card",
      description: "Reward description",
      pointsRequired: 20,
      isActive: true,
      createdAt: reward.createdAt.toISOString(),
    });

    await useCase.execute(5);

    expect(mapper.map).toHaveBeenCalledTimes(1);
    expect(mapper.map).toHaveBeenCalledWith(reward);
  });
});
