import { CustomerRewardQueryRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { Customer } from "@/core/domain/customers/customer.entity";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import {
  TopReward,
  CustomerRedeemedReward,
  CustomerRewardRedemption
} from "@/core/domain/customer-rewards/query-models";
import {
  CustomerRewardSelect,
  CustomerRewardTable,
  CustomerSelect,
  CustomerTable,
  RewardSelect,
  RewardTable
} from "@/core/infrastructure/database/drizzle/types";

const mockDate = new Date("2024-01-01T10:00:00Z");

const sampleRewardSelect: RewardSelect = {
  id: 1,
  name: "VIP Access",
  pointsRequired: 100,
  description: "VIP Area",
  isActive: 1,
  createdAt: mockDate,
};

const sampleCustomerSelect: CustomerSelect = {
  id: 10,
  name: "John Doe",
  phone: "1234-5678",
  points: 150,
  lastVisitAt: mockDate,
  createdAt: mockDate,
};

const sampleCustomerRewardSelect: CustomerRewardSelect = {
  id: 100,
  customerId: 10,
  rewardId: 1,
  redeemedAt: mockDate,
};

const sampleReward = new Reward({
  name: "VIP Access",
  pointsRequired: 100,
  description: "VIP Area",
  isActive: RewardStatus.Active,
  createdAt: mockDate
});

(sampleReward as any)._id = 1;

const sampleCustomer = new Customer({
  name: "John Doe",
  phone: "1234-5678",
  points: 150,
  createdAt: mockDate,
  lastVisitAt: mockDate
});
(sampleCustomer as any)._id = 10;

const sampleCustomerReward = new CustomerReward({
  customerId: 10,
  rewardId: 1,
  redeemedAt: mockDate
});
(sampleCustomerReward as any)._id = 100;

describe("CustomerRewardQueryRepositoryDrizzle", () => {
  let repository: CustomerRewardQueryRepositoryDrizzle;

  let mockDb: any;
  let mockChain: any;

  let mockRewardTable: RewardTable;
  let mockCustomerTable: CustomerTable;
  let mockCustomerRewardTable: CustomerRewardTable;

  let mockRewardMapper: jest.Mocked<Mapper<RewardSelect, Reward>>;
  let mockCustomerMapper: jest.Mocked<Mapper<CustomerSelect, Customer>>;
  let mockCustomerRewardMapper: jest.Mocked<Mapper<CustomerRewardSelect, CustomerReward>>;

  beforeEach(() => {
    mockRewardMapper = { map: jest.fn() };
    mockCustomerMapper = { map: jest.fn() };
    mockCustomerRewardMapper = { map: jest.fn() };

    mockChain = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: jest.fn((resolve, reject) => resolve([])),
    };

    mockDb = {
      select: jest.fn().mockReturnValue(mockChain),
    };

    mockRewardTable = { id: "r_id", pointsRequired: "r_points", isActive: "r_active" } as any;
    mockCustomerTable = { id: "c_id", points: "c_points" } as any;
    mockCustomerRewardTable = { id: "cr_id", rewardId: "cr_reward_id", customerId: "cr_cust_id" } as any;

    repository = new CustomerRewardQueryRepositoryDrizzle({
      dbClient: mockDb,
      rewardTable: mockRewardTable,
      rewardToDomainMapper: mockRewardMapper,
      customerTable: mockCustomerTable,
      customerToDomainMapper: mockCustomerMapper,
      customerRewardTable: mockCustomerRewardTable,
      customerRewardToDomainMapper: mockCustomerRewardMapper,
    });
  });

  describe("findAll", () => {
    it("should retrieve all customer rewards and map them", async () => {
      const dbResult = [sampleCustomerRewardSelect];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockCustomerRewardMapper.map.mockReturnValue(sampleCustomerReward);

      const result = await repository.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockCustomerRewardTable);
      expect(mockCustomerRewardMapper.map)
        .toHaveBeenCalledWith(sampleCustomerRewardSelect);
      expect(result).toEqual([sampleCustomerReward]);
    });

    it("should propagate DB errors", async () => {
      mockChain.then.mockImplementationOnce((_: any, reject: any) => reject(new Error("DB Error")));
      await expect(repository.findAll()).rejects.toThrow("DB Error");
    });
  });

  describe("findTopRewardsByRedeem", () => {
    it("should aggregate data, join rewards, and map to TopReward model", async () => {
      const dbResult = [
        {
          reward: sampleRewardSelect,
          redeemedCount: 5
        }
      ];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockRewardMapper.map.mockReturnValue(sampleReward);

      const limit = 3;
      const result = await repository.findTopRewardsByRedeem(limit);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockCustomerRewardTable);
      expect(mockChain.innerJoin).toHaveBeenCalled();
      expect(mockChain.groupBy).toHaveBeenCalled();
      expect(mockChain.orderBy).toHaveBeenCalled();
      expect(mockChain.limit).toHaveBeenCalledWith(limit);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(TopReward);
      expect(result[0].reward).toBe(sampleReward);
      expect(result[0].redeemedCount).toBe(5);
    });

    it("should handle empty results", async () => {
      mockChain.then.mockImplementationOnce((resolve: any) => resolve([]));
      const result = await repository.findTopRewardsByRedeem(5);
      expect(result).toEqual([]);
    });
  });

  describe("findRewardsRedeemedByCustomer", () => {
    it("should find rewards for a specific customer and map to CustomerRedeemedReward", async () => {
      const dbResult = [
        {
          reward: sampleRewardSelect,
          redeemedAt: mockDate
        }
      ];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockRewardMapper.map.mockReturnValue(sampleReward);

      const customerId = 10;
      const result = await repository.findRewardsRedeemedByCustomer(customerId);

      expect(mockChain.from).toHaveBeenCalledWith(mockCustomerRewardTable);
      expect(mockChain.innerJoin).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(CustomerRedeemedReward);
      expect(result[0].reward).toBe(sampleReward);
      expect(result[0].redeemedAt).toBe(mockDate);
    });
  });

  describe("findAvailableRewardsForCustomer", () => {
    it("should return rewards that match points and haven't been redeemed", async () => {
      const dbResult = [sampleRewardSelect];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockRewardMapper.map.mockReturnValue(sampleReward);

      const customerId = 99;
      const result = await repository.findAvailableRewardsForCustomer(customerId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockRewardTable);

      expect(mockChain.innerJoin).toHaveBeenCalled();
      expect(mockChain.leftJoin).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();

      expect(mockRewardMapper.map).toHaveBeenCalledWith(sampleRewardSelect);
      expect(result).toEqual([sampleReward]);
    });

    it("should propagate errors during available rewards search", async () => {
      mockChain.then.mockImplementationOnce((_: any, reject: any) => reject(new Error("Join Error")));
      await expect(repository.findAvailableRewardsForCustomer(1)).rejects.toThrow("Join Error");
    });
  });

  describe("findCustomersEligibleToRedeemReward", () => {
    it("should return customers with enough points who haven't redeemed the specific reward", async () => {
      const dbResult = [sampleCustomerSelect];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockCustomerMapper.map.mockReturnValue(sampleCustomer);

      const rewardId = 55;
      const result = await repository.findCustomersEligibleToRedeemReward(rewardId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockRewardTable);

      expect(mockChain.innerJoin).toHaveBeenCalled();
      expect(mockChain.leftJoin).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();

      expect(mockCustomerMapper.map).toHaveBeenCalledWith(sampleCustomerSelect);
      expect(result).toEqual([sampleCustomer]);
    });
  });

  describe("findCustomersWhoRedeemedReward", () => {
    it("should return customers and redemption date for a specific reward", async () => {
      const dbResult = [
        {
          customer: sampleCustomerSelect,
          redeemedAt: mockDate
        }
      ];
      mockChain.then.mockImplementationOnce((resolve: any) => resolve(dbResult));
      mockCustomerMapper.map.mockReturnValue(sampleCustomer);

      const rewardId = 77;
      const result = await repository.findCustomersWhoRedeemedReward(rewardId);

      expect(mockChain.from).toHaveBeenCalledWith(mockCustomerTable);
      expect(mockChain.innerJoin).toHaveBeenCalled();
      expect(mockChain.where).toHaveBeenCalled();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(CustomerRewardRedemption);
      expect(result[0].customer).toBe(sampleCustomer);
      expect(result[0].redeemedAt).toBe(mockDate);
    });

    it("should return empty list if no one redeemed", async () => {
      mockChain.then.mockImplementationOnce((resolve: any) => resolve([]));
      const result = await repository.findCustomersWhoRedeemedReward(77);
      expect(result).toEqual([]);
    });
  });
});