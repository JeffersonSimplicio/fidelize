import { DisableRewardUseCase } from "@/core/application/use-cases/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

describe("DisableRewardUseCase", () => {
  let rewardRepo: jest.Mocked<RewardRepository>;
  let useCase: DisableRewardUseCase;

  let mockReward: Reward;

  beforeEach(() => {
    rewardRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DisableRewardUseCase({ rewardRepo });

    mockReward = new Reward({
      name: "Test Reward",
      pointsRequired: 100,
      description: "Test reward",
      isActive: RewardStatus.Active,
    });
    mockReward.setId(1);

    jest.spyOn(mockReward, "deactivate");
  });

  it("should deactivate a reward and update it", async () => {
    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.update.mockResolvedValue(mockReward);

    await useCase.execute(1);

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(rewardRepo.getById).toHaveBeenCalledWith(1);

    expect(mockReward.deactivate).toHaveBeenCalledTimes(1);

    expect(rewardRepo.update).toHaveBeenCalledTimes(1);
    expect(rewardRepo.update).toHaveBeenCalledWith(mockReward);
  });

  it("should throw if reward does not exist", async () => {
    rewardRepo.getById.mockResolvedValue(null as any);

    await expect(useCase.execute(999)).rejects.toThrow();

    expect(rewardRepo.getById).toHaveBeenCalledWith(999);
    expect(rewardRepo.update).not.toHaveBeenCalled();
  });

  it("should propagate errors thrown by getById", async () => {
    rewardRepo.getById.mockRejectedValue(new Error("DB failure"));

    await expect(useCase.execute(1)).rejects.toThrow("DB failure");

    expect(rewardRepo.getById).toHaveBeenCalledTimes(1);
    expect(rewardRepo.update).not.toHaveBeenCalled();
  });

  it("should propagate errors thrown by update", async () => {
    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.update.mockRejectedValue(new Error("Update failed"));

    await expect(useCase.execute(1)).rejects.toThrow("Update failed");

    expect(mockReward.deactivate).toHaveBeenCalledTimes(1);
    expect(rewardRepo.update).toHaveBeenCalledTimes(1);
  });

  it("should still call update even if reward is already inactive", async () => {
    mockReward.deactivate();
    expect(mockReward.isActive).toBe(RewardStatus.Inactive);

    rewardRepo.getById.mockResolvedValue(mockReward);
    rewardRepo.update.mockResolvedValue(mockReward);

    await useCase.execute(1);

    expect(rewardRepo.update).toHaveBeenCalledWith(mockReward);
  });
});
