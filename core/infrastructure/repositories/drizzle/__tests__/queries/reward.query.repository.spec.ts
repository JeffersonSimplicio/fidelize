import { RewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { RewardSelect, RewardTable } from "@/core/infrastructure/database/drizzle/types";

describe("RewardQueryRepositoryDrizzle", () => {
  let repository: RewardQueryRepositoryDrizzle;

  let mockDb: any;
  let mockChain: any;
  let mockTable: RewardTable;
  let mockMapper: jest.Mocked<Mapper<RewardSelect, Reward>>;

  const sampleDbResult: RewardSelect[] = [
    {
      id: 1,
      name: "Free Coffee",
      pointsRequired: 50,
      description: "Get a free coffee",
      isActive: 1,
      createdAt: new Date("2024-01-01T10:00:00Z"),
    },
    {
      id: 2,
      name: "Discount Coupon",
      pointsRequired: 100,
      description: "10% off",
      isActive: 0,
      createdAt: new Date("2024-02-01T10:00:00Z"),
    },
  ];

  const sampleDomainMapped = [
    new Reward({
      name: "Free Coffee",
      pointsRequired: 50,
      description: "Get a free coffee",
      isActive: RewardStatus.Active,
    }),
    new Reward({
      name: "Discount Coupon",
      pointsRequired: 100,
      description: "10% off",
      isActive: RewardStatus.Inactive,
    }),
  ];

  beforeEach(() => {
    mockMapper = {
      map: jest.fn(),
    };

    mockChain = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn((resolve, reject) => resolve(sampleDbResult)),
    };

    mockDb = {
      select: jest.fn().mockReturnValue(mockChain),
    };

    mockTable = {
      name: "name_column",
      isActive: "is_active_column",
    } as any;

    repository = new RewardQueryRepositoryDrizzle({
      dbClient: mockDb,
      rewardTable: mockTable,
      rewardToDomainMapper: mockMapper,
    });
  });

  describe("findByName", () => {
    it("should find rewards by name using LIKE and map them", async () => {
      mockMapper.map
        .mockReturnValueOnce(sampleDomainMapped[0])
        .mockReturnValueOnce(sampleDomainMapped[1]);

      const result = await repository.findByName("Coffee");

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.where).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledTimes(2);
      expect(result).toEqual(sampleDomainMapped);
    });

    it("should return empty list when no match found", async () => {
      mockChain.then.mockImplementationOnce((resolve: any) => resolve([]));

      const result = await repository.findByName("NonExistent");

      expect(result).toEqual([]);
      expect(mockMapper.map).not.toHaveBeenCalled();
    });

    it("should propagate DB errors", async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error("DB Connection Failed"))
      );

      await expect(repository.findByName("Error")).rejects.toThrow("DB Connection Failed");
    });
  });

  describe("findAll", () => {
    it("should retrieve all rewards and map them", async () => {
      mockMapper.map
        .mockReturnValueOnce(sampleDomainMapped[0])
        .mockReturnValueOnce(sampleDomainMapped[1]);

      const result = await repository.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.where).not.toHaveBeenCalled();
      expect(result).toEqual(sampleDomainMapped);
    });

    it("should propagate DB errors", async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error("Fatal DB Error"))
      );

      await expect(repository.findAll()).rejects.toThrow("Fatal DB Error");
    });
  });

  describe("findAllActive", () => {
    it("should retrieve only active rewards", async () => {
      const activeOnlyDb = [sampleDbResult[0]];
      const activeOnlyDomain = [sampleDomainMapped[0]];

      mockChain.then.mockImplementationOnce((resolve: any) => resolve(activeOnlyDb));
      mockMapper.map.mockReturnValueOnce(activeOnlyDomain[0]);

      const result = await repository.findAllActive();

      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.where).toHaveBeenCalled();
      expect(result).toEqual(activeOnlyDomain);
    });

    it("should propagate DB errors during active fetch", async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error("Active Query Failed"))
      );

      await expect(repository.findAllActive()).rejects.toThrow("Active Query Failed");
    });
  });

  describe("findAllInactive", () => {
    it("should retrieve only inactive rewards", async () => {
      const inactiveOnlyDb = [sampleDbResult[1]];
      const inactiveOnlyDomain = [sampleDomainMapped[1]];

      mockChain.then.mockImplementationOnce((resolve: any) => resolve(inactiveOnlyDb));
      mockMapper.map.mockReturnValueOnce(inactiveOnlyDomain[0]);

      const result = await repository.findAllInactive();

      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.where).toHaveBeenCalled();
      expect(result).toEqual(inactiveOnlyDomain);
    });

    it("should propagate DB errors during inactive fetch", async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error("Inactive Query Failed"))
      );

      await expect(repository.findAllInactive()).rejects.toThrow("Inactive Query Failed");
    });
  });
});