import { CustomerQueryRepositoryDrizzle } from '@/core/infrastructure/repositories/drizzle';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import {
  CustomerSelect,
  CustomerTable,
} from '@/core/infrastructure/database/drizzle/types';

describe('CustomerQueryRepositoryDrizzle', () => {
  let repository: CustomerQueryRepositoryDrizzle;

  let mockDb: any;
  let mockChain: any;
  let mockTable: CustomerTable;
  let mockMapper: jest.Mocked<Mapper<CustomerSelect, Customer>>;

  const sampleDbResult: CustomerSelect[] = [
    {
      id: 1,
      name: 'John Doe',
      phone: '9999-9999',
      points: 100,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      lastVisitAt: new Date('2024-01-05T10:00:00Z'),
    },
    {
      id: 2,
      name: 'Joana',
      phone: '8888-8888',
      points: 200,
      createdAt: new Date('2024-02-01T10:00:00Z'),
      lastVisitAt: new Date('2024-02-05T10:00:00Z'),
    },
  ];

  const sampleDomainMapped = [
    new Customer({ name: 'John Doe', phone: '9999-9999', points: 100 }),
    new Customer({ name: 'Joana', phone: '8888-8888', points: 200 }),
  ];

  beforeEach(() => {
    mockMapper = {
      map: jest.fn(),
    };

    mockChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      then: jest.fn((resolve, _reject) => resolve(sampleDbResult)),
    };

    mockDb = {
      select: jest.fn().mockReturnValue(mockChain),
    };

    mockTable = {} as any;

    repository = new CustomerQueryRepositoryDrizzle({
      dbClient: mockDb,
      customerTable: mockTable,
      customerToDomainMapper: mockMapper,
    });
  });

  describe('findByName', () => {
    it('should query by name using LIKE and map results to domain entities', async () => {
      mockMapper.map
        .mockReturnValueOnce(sampleDomainMapped[0])
        .mockReturnValueOnce(sampleDomainMapped[1]);

      const result = await repository.findByName('Jo');

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.where).toHaveBeenCalled();
      expect(result).toEqual(sampleDomainMapped);
    });

    it('should return an empty array when no records exist', async () => {
      mockChain.then.mockImplementationOnce((resolve: any) => resolve([]));

      const result = await repository.findByName('Nobody');

      expect(result).toEqual([]);
      expect(mockMapper.map).not.toHaveBeenCalled();
    });

    it('should propagate errors thrown by the DB client', async () => {
      mockChain.then.mockImplementationOnce((resolve: any, reject: any) =>
        reject(new Error('DB ERROR')),
      );

      await expect(repository.findByName('test')).rejects.toThrow('DB ERROR');
    });
  });

  describe('findAll', () => {
    it('should retrieve all customers and map them', async () => {
      mockMapper.map
        .mockReturnValueOnce(sampleDomainMapped[0])
        .mockReturnValueOnce(sampleDomainMapped[1]);

      const result = await repository.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(result).toEqual(sampleDomainMapped);
    });

    it('should propagate DB errors', async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error('DB FAIL')),
      );

      await expect(repository.findAll()).rejects.toThrow('DB FAIL');
    });
  });

  describe('findTopCustomersByPoints', () => {
    it('should order by points descending, limit, and map results', async () => {
      mockMapper.map
        .mockReturnValueOnce(sampleDomainMapped[0])
        .mockReturnValueOnce(sampleDomainMapped[1]);

      const result = await repository.findTopCustomersByPoints(5);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockChain.from).toHaveBeenCalledWith(mockTable);
      expect(mockChain.orderBy).toHaveBeenCalled();
      expect(mockChain.limit).toHaveBeenCalledWith(5);
      expect(result).toEqual(sampleDomainMapped);
    });

    it('should propagate DB errors', async () => {
      mockChain.then.mockImplementationOnce((_resolve: any, reject: any) =>
        reject(new Error('DB ORDER FAIL')),
      );

      await expect(repository.findTopCustomersByPoints(2)).rejects.toThrow(
        'DB ORDER FAIL',
      );
    });
  });
});
