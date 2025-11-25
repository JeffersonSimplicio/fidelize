import { DeleteCustomerUseCase } from "@/core/application/use-cases/customers";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Customer } from "@/core/domain/customers/customer.entity";

describe("DeleteCustomerUseCase", () => {
  let customerRepo: jest.Mocked<CustomerRepository>;
  let useCase: DeleteCustomerUseCase;

  beforeEach(() => {
    customerRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteCustomerUseCase({ customerRepo });
  });

  it("should delete a customer successfully when the ID exists", async () => {
    const customer = new Customer({
      name: "Test User",
      phone: "99999-9999",
      points: 0,
    });
    customer.setId(1);

    customerRepo.getById.mockResolvedValue(customer);
    customerRepo.delete.mockResolvedValue();

    await useCase.execute(1);

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRepo.getById).toHaveBeenCalledWith(1);

    expect(customerRepo.delete).toHaveBeenCalledTimes(1);
    expect(customerRepo.delete).toHaveBeenCalledWith(1);
  });

  it("should throw an error when getById fails (customer not found)", async () => {
    customerRepo.getById.mockRejectedValue(new Error("Customer not found"));

    const action = useCase.execute(123);

    await expect(action).rejects.toThrow("Customer not found");

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRepo.delete).not.toHaveBeenCalled();
  });

  it("should throw an error if delete fails", async () => {
    const customer = new Customer({
      name: "Another Test",
      phone: "88888-8888",
      points: 10,
    });
    customer.setId(10);

    customerRepo.getById.mockResolvedValue(customer);
    customerRepo.delete.mockRejectedValue(new Error("Database delete error"));

    const action = useCase.execute(10);

    await expect(action).rejects.toThrow("Database delete error");

    expect(customerRepo.getById).toHaveBeenCalledTimes(1);
    expect(customerRepo.delete).toHaveBeenCalledTimes(1);
  });

  it("should call getById before delete", async () => {
    const executionOrder: string[] = [];

    customerRepo.getById.mockImplementation(async () => {
      executionOrder.push("getById");
      return new Customer({
        name: "Order Test",
        phone: "77777-7777",
        points: 5,
      });
    });

    customerRepo.delete.mockImplementation(async () => {
      executionOrder.push("delete");
    });

    await useCase.execute(999);

    expect(executionOrder).toEqual(["getById", "delete"]);
  });
});
