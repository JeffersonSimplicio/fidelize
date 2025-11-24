import { ListRewardsUseCase } from "@/core/application/use-cases/rewards";
import { RewardQueryRepository } from "@/core/domain/rewards/reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardDto } from "@/core/application/dtos/rewards";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

describe("ListRewardsUseCase", () => {
  let rewardQueryRepo: jest.Mocked<RewardQueryRepository>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;
  let useCase: ListRewardsUseCase;

  beforeEach(() => {
    rewardQueryRepo = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      findAllActive: jest.fn(),
      findAllInactive: jest.fn(),
    };

    rewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListRewardsUseCase({
      rewardQueryRepo,
      rewardToDtoMapper,
    });
  });

  it("should return a list of mapped reward DTOs (happy path)", async () => {
    const r1 = new Reward({
      name: "Reward One",
      description: "Desc 1",
      pointsRequired: 10,
      isActive: RewardStatus.Active,
    });
    r1.setId(1);

    const r2 = new Reward({
      name: "Reward Two",
      description: "Desc 2",
      pointsRequired: 20,
      isActive: RewardStatus.Inactive,
    });
    r2.setId(2);

    const dto1: RewardDto = {
      id: 1,
      name: "Reward One",
      pointsRequired: 10,
      description: "Desc 1",
      isActive: true,
      createdAt: r1.createdAt.toISOString(),
    };
    const dto2: RewardDto = {
      id: 2,
      name: "Reward Two",
      pointsRequired: 20,
      description: "Desc 2",
      isActive: false,
      createdAt: r2.createdAt.toISOString(),
    };

    rewardQueryRepo.findAll.mockResolvedValue([r1, r2]);
    rewardToDtoMapper.map.mockImplementation((r) => (r.id === 1 ? dto1 : dto2));

    const result = await useCase.execute();

    expect(rewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(rewardToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(1, r1);
    expect(rewardToDtoMapper.map).toHaveBeenNthCalledWith(2, r2);
    expect(result).toEqual([dto1, dto2]);
  });

  it("should return an empty array when repository returns no rewards", async () => {
    rewardQueryRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(rewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should propagate errors thrown by repository.findAll", async () => {
    rewardQueryRepo.findAll.mockRejectedValue(new Error("DB failure"));

    await expect(useCase.execute()).rejects.toThrow("DB failure");

    expect(rewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it("should propagate errors thrown by the mapper for an item", async () => {
    const r = new Reward({
      name: "Broken",
      description: "broken",
      pointsRequired: 1,
      isActive: RewardStatus.Active,
    });
    r.setId(7);

    rewardQueryRepo.findAll.mockResolvedValue([r]);
    rewardToDtoMapper.map.mockImplementation(() => {
      throw new Error("Mapping failed");
    });

    await expect(useCase.execute()).rejects.toThrow("Mapping failed");

    expect(rewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(r);
  });

  it("should only call findAll and not other query methods", async () => {
    const r = new Reward({
      name: "Only",
      description: "only",
      pointsRequired: 3,
      isActive: RewardStatus.Active,
    });
    r.setId(3);

    rewardQueryRepo.findAll.mockResolvedValue([r]);
    rewardToDtoMapper.map.mockReturnValue({
      id: 3,
      name: "Only",
      pointsRequired: 3,
      description: "only",
      isActive: true,
      createdAt: r.createdAt.toISOString(),
    });

    await useCase.execute();

    expect(rewardQueryRepo.findAll).toHaveBeenCalledTimes(1);
    expect(rewardQueryRepo.findByName).not.toHaveBeenCalled();
    expect(rewardQueryRepo.findAllActive).not.toHaveBeenCalled();
    expect(rewardQueryRepo.findAllInactive).not.toHaveBeenCalled();
  });

  it("should preserve the order of mapped results", async () => {
    const a = new Reward({ name: "A", description: "a", pointsRequired: 1 });
    a.setId(10);
    const b = new Reward({ name: "B", description: "b", pointsRequired: 2 });
    b.setId(11);

    rewardQueryRepo.findAll.mockResolvedValue([a, b]);

    const dtoA: RewardDto = { id: 10, name: "A", pointsRequired: 1, description: "a", isActive: true, createdAt: a.createdAt.toISOString() };
    const dtoB: RewardDto = { id: 11, name: "B", pointsRequired: 2, description: "b", isActive: true, createdAt: b.createdAt.toISOString() };

    rewardToDtoMapper.map.mockImplementation((r) => (r.id === 10 ? dtoA : dtoB));

    const result = await useCase.execute();

    expect(result).toEqual([dtoA, dtoB]);
  });
});
