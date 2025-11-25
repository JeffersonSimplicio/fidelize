import { CustomerRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer } from "@/core/domain/customers/customer.entity";
import { CustomerNotFoundError } from "@/core/domain/customers/errors";
import { CustomerSelect, CustomerTable } from "@/core/infrastructure/database/drizzle/types";

describe("CustomerRepositoryDrizzle", () => {
  let repository: CustomerRepositoryDrizzle;

  let mockDb: any;
  let mockMapper: jest.Mocked<Mapper<CustomerSelect, Customer>>;
  let mockTable: CustomerTable;

  let mockSelectChain: {
    from: jest.Mock;
    where: jest.Mock;
    limit: jest.Mock;
    get: jest.Mock;
  };

  const sampleDate = new Date("2024-01-01T10:00:00Z");
  const sampleCustomerPhone = "123456789";

  const sampleCustomerSelect: CustomerSelect = {
    id: 1,
    name: "Jane Doe",
    phone: sampleCustomerPhone,
    points: 150,
    createdAt: sampleDate,
    lastVisitAt: sampleDate,
  };

  const sampleCustomerDomain = new Customer({
    name: "Jane Doe",
    phone: sampleCustomerPhone,
    points: 150,
    createdAt: sampleDate,
    lastVisitAt: sampleDate,
  });
  (sampleCustomerDomain as any)._id = 1;

  beforeEach(() => {
    mockMapper = {
      map: jest.fn(),
    };

    mockTable = {
      id: "id_column",
      phone: "phone_column",
    } as any;

    mockSelectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnValue(sampleCustomerSelect),
    };

    mockDb = {
      select: jest.fn().mockReturnValue(mockSelectChain),
    };

    repository = new CustomerRepositoryDrizzle({
      dbClient: mockDb,
      customerTable: mockTable,
      customerToDomainMapper: mockMapper,
    });
  });

  describe("create", () => {
    it("should insert a new customer and return the mapped domain entity", async () => {
      const returningMock = jest.fn().mockResolvedValue([sampleCustomerSelect]);
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      mockDb.insert = jest.fn().mockReturnValue({ values: valuesMock });
      mockMapper.map.mockReturnValue(sampleCustomerDomain);

      const result = await repository.create(sampleCustomerDomain);

      expect(mockDb.insert).toHaveBeenCalledWith(mockTable);
      expect(valuesMock).toHaveBeenCalledWith(sampleCustomerDomain.toPersistence());
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerSelect);
      expect(result).toBe(sampleCustomerDomain);
    });

    it("should propagate DB errors during creation", async () => {
      const returningMock = jest.fn().mockRejectedValue(new Error("DB Constraint Error"));
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      mockDb.insert = jest.fn().mockReturnValue({ values: valuesMock });

      await expect(repository.create(sampleCustomerDomain)).rejects.toThrow("DB Constraint Error");
    });
  });

  describe("getById", () => {
    it("should return the customer when found by ID", async () => {
      mockMapper.map.mockReturnValue(sampleCustomerDomain);

      const result = await repository.getById(1);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelectChain.get).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerSelect);
      expect(result).toBe(sampleCustomerDomain);
    });

    it("should throw CustomerNotFoundError when ID is not found", async () => {
      mockSelectChain.get.mockReturnValue(undefined);

      await expect(repository.getById(999)).rejects.toThrow(CustomerNotFoundError);
      expect(mockMapper.map).not.toHaveBeenCalled();
    });
  });

  describe("findByPhone", () => {
    it("should return the customer when found by phone number", async () => {
      mockMapper.map.mockReturnValue(sampleCustomerDomain);

      const result = await repository.findByPhone(sampleCustomerPhone);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockSelectChain.get).toHaveBeenCalled();
      expect(mockMapper.map).toHaveBeenCalledWith(sampleCustomerSelect);
      expect(result).toBe(sampleCustomerDomain);
    });

    it("should return null when phone number is not found", async () => {
      mockSelectChain.get.mockReturnValue(undefined);

      const result = await repository.findByPhone("111111111");

      expect(mockSelectChain.get).toHaveBeenCalled();
      expect(mockMapper.map).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update customer data and return the mapped result", async () => {
      const updatedSelect: CustomerSelect = { ...sampleCustomerSelect, points: 200 };
      const updatedDomain: Customer = { ...sampleCustomerDomain, points: 200 } as any;

      const returningMock = jest.fn().mockResolvedValue([updatedSelect]);
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock });
      const setMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.update = jest.fn().mockReturnValue({ set: setMock });
      mockMapper.map.mockReturnValue(updatedDomain);

      const { id, ...dataWithoutId } = sampleCustomerDomain.toPersistence();

      const result = await repository.update(sampleCustomerDomain);

      expect(mockDb.update).toHaveBeenCalledWith(mockTable);
      expect(setMock).toHaveBeenCalledWith(dataWithoutId);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toBe(updatedDomain);
    });

    it("should propagate DB errors during update", async () => {
      const returningMock = jest.fn().mockRejectedValue(new Error("Update Failed"));
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock });
      const setMock = jest.fn().mockReturnValue({ where: whereMock });
      mockDb.update = jest.fn().mockReturnValue({ set: setMock });

      await expect(repository.update(sampleCustomerDomain)).rejects.toThrow("Update Failed");
    });
  });

  describe("delete", () => {
    it("should call delete on the DB client with the correct ID condition", async () => {
      const whereMock = jest.fn().mockImplementation(() => Promise.resolve());
      mockDb.delete = jest.fn().mockReturnValue({ where: whereMock });

      await repository.delete(1);

      expect(mockDb.delete).toHaveBeenCalledWith(mockTable);
      expect(whereMock).toHaveBeenCalled();
    });

    it("should propagate DB errors during deletion", async () => {
      const whereMock = jest.fn().mockRejectedValue(new Error("Delete Constraint Error"));
      mockDb.delete = jest.fn().mockReturnValue({ where: whereMock });

      await expect(repository.delete(1)).rejects.toThrow("Delete Constraint Error");
    });
  });
});