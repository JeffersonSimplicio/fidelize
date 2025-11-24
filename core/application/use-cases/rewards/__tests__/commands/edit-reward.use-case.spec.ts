import { EditRewardUseCase } from "@/core/application/use-cases/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Validation } from "@/core/domain/validation/validation.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { UpdateRewardDto, RewardDto } from "@/core/application/dtos/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

describe("EditRewardUseCase", () => {
  let useCase: EditRewardUseCase;
  let rewardRepo: jest.Mocked<RewardRepository>;
  let editRewardValidator: jest.Mocked<Validation<UpdateRewardDto>>;
  let rewardToDtoMapper: jest.Mocked<Mapper<Reward, RewardDto>>;

  const existingReward = new Reward({
    name: "Old Name",
    pointsRequired: 50,
    description: "Old description",
  });
  existingReward.setId(11);

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    editRewardValidator = {
      validate: jest.fn(),
    };

    rewardToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new EditRewardUseCase({
      rewardRepo,
      editRewardValidator,
      rewardToDtoMapper,
    });
  });

  it("should throw ValidationException when validator returns errors", async () => {
    editRewardValidator.validate.mockReturnValue([
      { field: "pointsRequired", message: "must be >= 1" },
    ]);

    const dto: UpdateRewardDto = { name: "X" };

    await expect(useCase.execute(11, dto)).rejects.toBeInstanceOf(ValidationException);

    expect(editRewardValidator.validate).toHaveBeenCalledWith(dto);
    expect(rewardRepo.getById).not.toHaveBeenCalled();
    expect(rewardRepo.update).not.toHaveBeenCalled();
  });

  it("should propagate error when rewardRepo.getById throws", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    rewardRepo.getById.mockRejectedValue(new Error("not found"));

    const dto: UpdateRewardDto = { name: "New" };

    await expect(useCase.execute(11, dto)).rejects.toThrow("not found");

    expect(rewardRepo.getById).toHaveBeenCalledWith(11);
    expect(rewardRepo.update).not.toHaveBeenCalled();
  });

  it("should update all fields when provided and return mapped DTO (happy path)", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    rewardRepo.getById.mockResolvedValue(existingReward);

    rewardRepo.update.mockImplementation(async (r) => {
      return r;
    });

    const expectedDto: RewardDto = {
      id: existingReward.id!,
      name: "New Name",
      pointsRequired: 120,
      description: "New description",
      isActive: existingReward.isActive === RewardStatus.Active,
      createdAt: expect.any(String),
    };
    rewardToDtoMapper.map.mockReturnValue(expectedDto);

    const dto: UpdateRewardDto = {
      name: "New Name",
      pointsRequired: 120,
      description: "New description",
    };

    const result = await useCase.execute(existingReward.id!, dto);

    expect(editRewardValidator.validate).toHaveBeenCalledWith(dto);
    expect(rewardRepo.getById).toHaveBeenCalledWith(existingReward.id);

    expect(rewardRepo.update).toHaveBeenCalledTimes(1);
    const passedReward = rewardRepo.update.mock.calls[0][0] as Reward;
    expect(passedReward).toBeInstanceOf(Reward);
    expect(passedReward.name).toBe(dto.name);
    expect(passedReward.pointsRequired).toBe(dto.pointsRequired);
    expect(passedReward.description).toBe(dto.description);

    expect(passedReward.id).toBe(existingReward.id);

    expect(rewardToDtoMapper.map).toHaveBeenCalledWith(passedReward);

    expect(result).toEqual(expectedDto);
  });

  it("should keep existing values for omitted fields", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    rewardRepo.getById.mockResolvedValue(existingReward);
    rewardRepo.update.mockImplementation(async (r) => r);

    const expectedDto: RewardDto = {
      id: existingReward.id!,
      name: existingReward.name,
      pointsRequired: existingReward.pointsRequired,
      description: existingReward.description,
      isActive: existingReward.isActive === RewardStatus.Active,
      createdAt: expect.any(String),
    };
    rewardToDtoMapper.map.mockReturnValue(expectedDto);

    const dto: UpdateRewardDto = {};

    const result = await useCase.execute(existingReward.id!, dto);

    const passedReward = rewardRepo.update.mock.calls[0][0] as Reward;

    expect(passedReward.name).toBe(existingReward.name);
    expect(passedReward.pointsRequired).toBe(existingReward.pointsRequired);
    expect(passedReward.description).toBe(existingReward.description);
    expect(passedReward.id).toBe(existingReward.id);

    expect(result).toEqual(expectedDto);
  });

  it("should propagate error when rewardRepo.update throws", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    rewardRepo.getById.mockResolvedValue(existingReward);
    rewardRepo.update.mockRejectedValue(new Error("update failed"));

    const dto: UpdateRewardDto = { name: "Whatever" };

    await expect(useCase.execute(existingReward.id!, dto)).rejects.toThrow("update failed");

    expect(rewardRepo.getById).toHaveBeenCalledWith(existingReward.id);
    expect(rewardRepo.update).toHaveBeenCalled();
    expect(rewardToDtoMapper.map).not.toHaveBeenCalled();
  });

  it("should propagate error when mapper.map throws", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    rewardRepo.getById.mockResolvedValue(existingReward);
    rewardRepo.update.mockImplementation(async (r) => r);

    rewardToDtoMapper.map.mockImplementation(() => {
      throw new Error("mapper broken");
    });

    const dto: UpdateRewardDto = { description: "desc" };

    await expect(useCase.execute(existingReward.id!, dto)).rejects.toThrow("mapper broken");

    expect(rewardRepo.update).toHaveBeenCalled();
    expect(rewardToDtoMapper.map).toHaveBeenCalled();
  });

  it("should call getById before update (order of operations)", async () => {
    editRewardValidator.validate.mockReturnValue([]);
    const callOrder: string[] = [];

    rewardRepo.getById.mockImplementation(async () => {
      callOrder.push("getById");
      return existingReward;
    });
    rewardRepo.update.mockImplementation(async () => {
      callOrder.push("update");
      return existingReward;
    });
    rewardToDtoMapper.map.mockReturnValue({
      id: existingReward.id!,
      name: existingReward.name,
      pointsRequired: existingReward.pointsRequired,
      description: existingReward.description,
      isActive: existingReward.isActive === RewardStatus.Active,
      createdAt: existingReward.createdAt.toISOString(),
    });

    await useCase.execute(existingReward.id!, { name: "x" });

    expect(callOrder).toEqual(["getById", "update"]);
  });
});
