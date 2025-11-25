import { DeleteRewardUseCase } from "@/core/application/use-cases/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

describe("DeleteRewardUseCase", () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let useCase: DeleteRewardUseCase;

  let mockReward: Reward;

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteRewardUseCase({ rewardRepo });

    mockReward = new Reward({
      name: "Test Reward",
      pointsRequired: 50,
      description: "Desc",
      isActive: RewardStatus.Active,
    });

    mockReward.setId(1);
  });

  it("should delete reward when it exists", async () => {
    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.delete.mockResolvedValue();

    await useCase.execute(1);

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(rewardRepo.getById).toHaveBeenCalledWith(1);

    expect(rewardRepo.delete).toHaveBeenCalledTimes(1);
    expect(rewardRepo.delete).toHaveBeenCalledWith(1);
  });

  it("should throw if reward does not exist", async () => {
    rewardRepo.getById.mockResolvedValue(null as any);

    await expect(useCase.execute(999)).rejects.toThrow();

    expect(rewardRepo.getById).toHaveBeenCalledWith(999);
    expect(rewardRepo.delete).not.toHaveBeenCalled();
  });

  it("should propagate error thrown by getById", async () => {
    rewardRepo.getById.mockRejectedValue(new Error("DB read error"));

    await expect(useCase.execute(1)).rejects.toThrow("DB read error");

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(rewardRepo.delete).not.toHaveBeenCalled();
  });

  it("should propagate error thrown by delete", async () => {
    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.delete.mockRejectedValue(new Error("Delete failed"));

    await expect(useCase.execute(1)).rejects.toThrow("Delete failed");

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(rewardRepo.delete).toHaveBeenCalledTimes(1);
  });

  it("should still try getById if id is zero", async () => {
    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.delete.mockResolvedValue();

    await useCase.execute(0);

    expect(rewardRepo.getById).toHaveBeenCalledWith(0);
    expect(rewardRepo.delete).toHaveBeenCalledWith(0);
  });

  it("should reject if id is NaN", async () => {
    await expect(useCase.execute(NaN)).rejects.toThrow();
    expect(rewardRepo.getById).not.toHaveBeenCalled();
    expect(rewardRepo.delete).not.toHaveBeenCalled();
  });
});
