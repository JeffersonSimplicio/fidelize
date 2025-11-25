import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { CustomerRewardNotFoundError } from "@/core/domain/customer-rewards/errors";
import { CustomerRewardSelect, CustomerRewardTable } from "@/core/infrastructure/database/drizzle/types";

describe("CustomerRewardRepositoryDrizzle", () => {
  let repository: CustomerRewardRepositoryDrizzle;

  let mockDb: any;
  let mockMapper: jest.Mocked<Mapper<CustomerRewardSelect, CustomerReward>>;
  let mockTable: CustomerRewardTable;

  const sampleDate = new Date("2024-01-01T10:00:00Z");
  const sampleCustomerId = 10;
  const sampleRewardId = 5;

  const sampleCustomerRewardSelect: CustomerRewardSelect = {
    id: 100,
    customerId: sampleCustomerId,
    rewardId: sampleRewardId,
    redeemedAt: sampleDate,
  };

  const sampleCustomerRewardDomain = new CustomerReward({
    customerId: sampleCustomerId,
    rewardId: sampleRewardId,
    redeemedAt: sampleDate,
  });
  (sampleCustomerRewardDomain as any)._id = 100;

  beforeEach(() => {
    mockMapper = {
      map: jest.fn(),
    };

    mockTable = {
      id: "id_column",
      customerId: "customerId_column",
      rewardId: "rewardId_column",
    } as any;

    mockDb = {};

    repository = new CustomerRewardRepositoryDrizzle({
      dbClient: mockDb,
      customerRewardTable: mockTable,
      customerRewardToDomainMapper: mockMapper,
    });
  });

  describe("create", () => {
    it("should insert a new customer reward and return the mapped domain entity", async () => {
      const returningMock = jest.fn().mockResolvedValue([sampleCustomerRewardSelect]);
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      mockDb.insert = jest.fn().mockReturnValue({ values: valuesMock });
      mockMapper.map.mockReturnValue(sampleCustomerRewardDomain);

      const result = await repository.create(sampleCustomerRewardDomain);

      expect(mockDb.insert).toHaveBeenCalledWith(mockTable);
      expect(valuesMock).toHaveBeenCalledWith(sampleCustomerRewardDomain.toPersistence());
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerRewardSelect);
      expect(result).toBe(sampleCustomerRewardDomain);
    });

    it("should propagate DB errors during creation", async () => {
      const returningMock = jest.fn().mockRejectedValue(new Error("Unique constraint violation"));
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      mockDb.insert = jest.fn().mockReturnValue({ values: valuesMock });

      await expect(repository.create(sampleCustomerRewardDomain)).rejects.toThrow("Unique constraint violation");
    });
  });

  describe("getById", () => {
    const setupSyncSelectChain = (result: CustomerRewardSelect | undefined) => {
      const getMock = jest.fn().mockReturnValue(result);
      const whereMock = jest.fn().mockReturnValue({ get: getMock });
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.select = jest.fn().mockReturnValue({ from: fromMock });
      return { getMock, whereMock };
    };

    it("should return the customer reward when found by ID", async () => {
      const { whereMock } = setupSyncSelectChain(sampleCustomerRewardSelect);
      mockMapper.map.mockReturnValue(sampleCustomerRewardDomain);

      const result = await repository.getById(100);

      expect(mockDb.select).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerRewardSelect);
      expect(result).toBe(sampleCustomerRewardDomain);
    });

    it("should throw CustomerRewardNotFoundError when ID is not found", async () => {
      setupSyncSelectChain(undefined);

      await expect(repository.getById(999)).rejects.toThrow(CustomerRewardNotFoundError);
      expect(mockMapper.map).not.toHaveBeenCalled();
    });
  });

  describe("alreadyRedeemed", () => {
    const setupSyncSelectChain = (result: CustomerRewardSelect | undefined) => {
      const getMock = jest.fn().mockReturnValue(result);
      const whereMock = jest.fn().mockReturnValue({ get: getMock });
      const fromMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.select = jest.fn().mockReturnValue({ from: fromMock });
      return { whereMock };
    };

    it("should return the CustomerReward entity if the reward was already redeemed by the customer", async () => {
      const { whereMock } = setupSyncSelectChain(sampleCustomerRewardSelect);
      mockMapper.map.mockReturnValue(sampleCustomerRewardDomain);

      const result = await repository.alreadyRedeemed(sampleCustomerId, sampleRewardId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerRewardSelect);
      expect(result).toBe(sampleCustomerRewardDomain);
    });

    it("should return null if the reward was NOT redeemed by the customer", async () => {
      setupSyncSelectChain(undefined);

      const result = await repository.alreadyRedeemed(99, 99);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockMapper.map).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete the customer reward by ID", async () => {
      const whereMock = jest.fn().mockImplementation(() => Promise.resolve());
      mockDb.delete = jest.fn().mockReturnValue({ where: whereMock });

      await repository.delete(100);

      expect(mockDb.delete).toHaveBeenCalledWith(mockTable);
      expect(whereMock).toHaveBeenCalled();
    });

    it("should propagate DB errors during deletion", async () => {
      const whereMock = jest.fn().mockRejectedValue(new Error("DB Error on delete"));
      mockDb.delete = jest.fn().mockReturnValue({ where: whereMock });

      await expect(repository.delete(100)).rejects.toThrow("DB Error on delete");
    });
  });
});