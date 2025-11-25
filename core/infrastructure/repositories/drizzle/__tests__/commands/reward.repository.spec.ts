import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle"; // Adjust path
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { RewardNotFoundError } from "@/core/domain/rewards/errors";
import { RewardSelect, RewardTable } from "@/core/infrastructure/database/drizzle/types";

describe("RewardRepositoryDrizzle", () => {
  let repository: RewardRepositoryDrizzle;

  let mockDb: any;
  let mockMapper: jest.Mocked<Mapper<RewardSelect, Reward>>;
  let mockTable: RewardTable;

  const sampleDate = new Date("2024-01-01T10:00:00Z");

  const sampleRewardSelect: RewardSelect = {
    id: 1,
    name: "Free Coffee",
    pointsRequired: 50,
    description: "One free coffee",
    isActive: 1,
    createdAt: sampleDate,
  };

  const sampleRewardDomain = new Reward({
    name: "Free Coffee",
    pointsRequired: 50,
    description: "One free coffee",
    isActive: RewardStatus.Active,
    createdAt: sampleDate,
  });
  (sampleRewardDomain as any)._id = 1;

  beforeEach(() => {
    mockMapper = {
      map: jest.fn(),
    };

    mockTable = {
      id: "id_column",
    } as any;

    mockDb = {};

    repository = new RewardRepositoryDrizzle({
      dbClient: mockDb,
      rewardTable: mockTable,
      rewardToDomainMapper: mockMapper,
    });
  });

  describe("create", () => {
    it("should insert a new reward and return the mapped domain entity", async () => {
      // Arrange
      const returningMock = jest.fn().mockResolvedValue([sampleRewardSelect]);
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      const insertMock = jest.fn().mockReturnValue({ values: valuesMock });

      mockDb.insert = insertMock;
      mockMapper.map.mockReturnValue(sampleRewardDomain);

      const result = await repository.create(sampleRewardDomain);

      expect(mockDb.insert).toHaveBeenCalledWith(mockTable);
      expect(valuesMock).toHaveBeenCalledWith(sampleRewardDomain.toPersistence());
      expect(returningMock).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleRewardSelect);
      expect(result).toBe(sampleRewardDomain);
    });

    it("should propagate DB errors during creation", async () => {
      const returningMock = jest.fn().mockRejectedValue(new Error("Insert Failed"));
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      mockDb.insert = jest.fn().mockReturnValue({ values: valuesMock });

      await expect(repository.create(sampleRewardDomain)).rejects.toThrow("Insert Failed");
    });
  });

  describe("getById", () => {
    it("should return the reward when found", async () => {
      const getMock = jest.fn().mockReturnValue(sampleRewardSelect);
      const whereMock = jest.fn().mockReturnValue({ get: getMock });
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      const selectMock = jest.fn().mockReturnValue({ from: fromMock });

      mockDb.select = selectMock;
      mockMapper.map.mockReturnValue(sampleRewardDomain);

      const result = await repository.getById(1);

      expect(mockDb.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(mockTable);
      expect(whereMock).toHaveBeenCalled();
      expect(getMock).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleRewardSelect);
      expect(result).toBe(sampleRewardDomain);
    });

    it("should throw RewardNotFoundError when not found", async () => {
      const getMock = jest.fn().mockReturnValue(undefined);
      const whereMock = jest.fn().mockReturnValue({ get: getMock });
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.select = jest.fn().mockReturnValue({ from: fromMock });

      await expect(repository.getById(999)).rejects.toThrow(RewardNotFoundError);
      expect(mockMapper.map).not.toHaveBeenCalled();
    });

    it("should propagate unexpected DB errors", async () => {
      const getMock = jest.fn().mockImplementation(() => {
        throw new Error("DB Connection Error");
      });
      const whereMock = jest.fn().mockReturnValue({ get: getMock });
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.select = jest.fn().mockReturnValue({ from: fromMock });

      await expect(repository.getById(1)).rejects.toThrow("DB Connection Error");
    });
  });

  describe("update", () => {
    it("should update the reward and return the mapped result", async () => {
      const returningMock = jest.fn().mockResolvedValue([sampleRewardSelect]);
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock });
      const setMock = jest.fn().mockReturnValue({ where: whereMock });
      const updateMock = jest.fn().mockReturnValue({ set: setMock });

      mockDb.update = updateMock;
      mockMapper.map.mockReturnValue(sampleRewardDomain);

      const { id, ...dataWithoutId } = sampleRewardDomain.toPersistence();

      const result = await repository.update(sampleRewardDomain);

      expect(mockDb.update).toHaveBeenCalledWith(mockTable);
      expect(setMock).toHaveBeenCalledWith(dataWithoutId);
      expect(whereMock).toHaveBeenCalled();
      expect(returningMock).toHaveBeenCalled();
      expect(result).toBe(sampleRewardDomain);
    });

    it("should propagate DB errors during update", async () => {
      const returningMock = jest.fn().mockRejectedValue(new Error("Update Failed"));
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock });
      const setMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.update = jest.fn().mockReturnValue({ set: setMock });

      await expect(repository.update(sampleRewardDomain)).rejects.toThrow("Update Failed");
    });
  });

  describe("delete", () => {
    it("should delete the reward by id", async () => {
      const whereMock = jest.fn().mockImplementation(() => Promise.resolve());
      const deleteMock = jest.fn().mockReturnValue({ where: whereMock });

      mockDb.delete = deleteMock;

      await repository.delete(1);

      expect(mockDb.delete).toHaveBeenCalledWith(mockTable);
      expect(whereMock).toHaveBeenCalled();
    });

    it("should propagate DB errors during delete", async () => {
      const whereMock = jest.fn().mockRejectedValue(new Error("Delete Failed"));
      mockDb.delete = jest.fn().mockReturnValue({ where: whereMock });

      await expect(repository.delete(1)).rejects.toThrow("Delete Failed");
    });
  });
});