import { ListTopCustomersByPointsUseCase } from '@/core/application/use-cases/customers';
import { CustomerQueryRepository } from '@/core/domain/customers/customer.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Customer } from '@/core/domain/customers/customer.entity';
import { CustomerDto } from '@/core/application/dtos';

describe('ListTopCustomersByPointsUseCase', () => {
  let customerQueryRepo: jest.Mocked<CustomerQueryRepository>;
  let customerToDtoMapper: jest.Mocked<Mapper<Customer, CustomerDto>>;
  let useCase: ListTopCustomersByPointsUseCase;

  beforeEach(() => {
    customerQueryRepo = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      findTopCustomersByPoints: jest.fn(),
    };

    customerToDtoMapper = {
      map: jest.fn(),
    };

    useCase = new ListTopCustomersByPointsUseCase({
      customerQueryRepo,
      customerToDtoMapper,
    });
  });

  it('should return top customers using the default limit when none is provided (happy path)', async () => {
    const c1 = new Customer({ name: 'A', phone: '1', points: 100 });
    c1.setId(1);
    const c2 = new Customer({ name: 'B', phone: '2', points: 90 });
    c2.setId(2);
    const customers = [c1, c2];

    const dto1: CustomerDto = {
      id: 1,
      name: 'A',
      phone: '1',
      points: 100,
      createdAt: c1.createdAt.toISOString(),
      lastVisitAt: c1.lastVisitAt.toISOString(),
    };
    const dto2: CustomerDto = {
      id: 2,
      name: 'B',
      phone: '2',
      points: 90,
      createdAt: c2.createdAt.toISOString(),
      lastVisitAt: c2.lastVisitAt.toISOString(),
    };

    customerQueryRepo.findTopCustomersByPoints.mockResolvedValue(customers);
    customerToDtoMapper.map.mockImplementation((c) =>
      c.id === 1 ? dto1 : dto2,
    );

    const result = await useCase.execute();

    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(3);
    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledTimes(1);

    expect(customerToDtoMapper.map).toHaveBeenCalledTimes(2);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(1, c1);
    expect(customerToDtoMapper.map).toHaveBeenNthCalledWith(2, c2);

    expect(result).toEqual([dto1, dto2]);
  });

  it('should call repository with the provided positive limit', async () => {
    const c = new Customer({ name: 'X', phone: '9', points: 50 });
    c.setId(9);

    const dto: CustomerDto = {
      id: 9,
      name: 'X',
      phone: '9',
      points: 50,
      createdAt: c.createdAt.toISOString(),
      lastVisitAt: c.lastVisitAt.toISOString(),
    };

    customerQueryRepo.findTopCustomersByPoints.mockResolvedValue([c]);
    customerToDtoMapper.map.mockReturnValue(dto);

    const providedLimit = 5;
    const result = await useCase.execute(providedLimit);

    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(
      providedLimit,
    );
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(c);
    expect(result).toEqual([dto]);
  });

  it('should enforce MIN_LIMIT when provided limit is less than minimum (e.g., 0 or negative)', async () => {
    const c = new Customer({ name: 'Y', phone: '8', points: 30 });
    c.setId(8);

    const dto: CustomerDto = {
      id: 8,
      name: 'Y',
      phone: '8',
      points: 30,
      createdAt: c.createdAt.toISOString(),
      lastVisitAt: c.lastVisitAt.toISOString(),
    };

    customerQueryRepo.findTopCustomersByPoints.mockResolvedValue([c]);
    customerToDtoMapper.map.mockReturnValue(dto);

    const result = await useCase.execute(0);
    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(1);
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(c);
    expect(result).toEqual([dto]);
  });

  it('should return an empty array when repository returns no customers', async () => {
    customerQueryRepo.findTopCustomersByPoints.mockResolvedValue([]);

    const result = await useCase.execute(3);

    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(3);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should propagate errors thrown by the repository', async () => {
    customerQueryRepo.findTopCustomersByPoints.mockRejectedValue(
      new Error('DB failure'),
    );

    await expect(useCase.execute(2)).rejects.toThrow('DB failure');
    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(2);
    expect(customerToDtoMapper.map).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by the mapper', async () => {
    const c = new Customer({ name: 'Z', phone: '7', points: 70 });
    c.setId(7);

    customerQueryRepo.findTopCustomersByPoints.mockResolvedValue([c]);
    customerToDtoMapper.map.mockImplementation(() => {
      throw new Error('Mapper error');
    });

    await expect(useCase.execute(3)).rejects.toThrow('Mapper error');
    expect(customerQueryRepo.findTopCustomersByPoints).toHaveBeenCalledWith(3);
    expect(customerToDtoMapper.map).toHaveBeenCalledWith(c);
  });
});
