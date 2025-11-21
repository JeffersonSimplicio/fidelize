import { Customer } from "@/core/domain/customers/customer.entity";
import {
  ensureLastVisitAfterCreation,
  ensureNonNegativePoint,
} from "@/core/domain/customers/rules"
import { ensureIdNotSet, ensureDatesNotInFuture } from "@/core/domain/shared/rules";

jest.mock("@/core/domain/customers/rules", () => ({
  ensureLastVisitAfterCreation: jest.fn(),
  ensureNonNegativePoint: jest.fn(),
}));
jest.mock("@/core/domain/shared/rules", () => ({
  ensureIdNotSet: jest.fn(),
  ensureDatesNotInFuture: jest.fn(),
}));

describe("Customer Entity", () => {
  describe("Success cases", () => {
    const fakeDate = new Date("2025-01-01T00:00:00Z");

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers().setSystemTime(fakeDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should create a customer with provided values", () => {
      const customer = new Customer({
        name: "Jefferson",
        phone: "123456789",
        points: 100,
      });

      expect(customer.name).toBe("Jefferson");
      expect(customer.phone).toBe("123456789");
      expect(customer.points).toBe(100);
      expect(customer.createdAt).toEqual(fakeDate);
      expect(customer.lastVisitAt).toEqual(fakeDate);

      expect(ensureNonNegativePoint).toHaveBeenCalledWith(100, 0);
      expect(ensureLastVisitAfterCreation).toHaveBeenCalled();
      expect(ensureDatesNotInFuture).toHaveBeenCalled();
    });

    it("should set the customer id", () => {
      const customer = new Customer({ name: "A", phone: "1", points: 0 });
      customer.setId(5);

      expect(customer.id).toBe(5);
      expect(ensureIdNotSet).toHaveBeenCalled();
    });

    it("should update points", () => {
      const customer = new Customer({ name: "A", phone: "1", points: 0 });
      customer.setPoints(50);

      expect(customer.points).toBe(50);
      expect(ensureNonNegativePoint).toHaveBeenCalledWith(50, 0);
    });

    it("should update last visit date", () => {
      const customer = new Customer({ name: "A", phone: "1", points: 0 });
      const newDate = new Date("2025-02-01T00:00:00Z");

      customer.updateLastVisit(newDate);
      expect(customer.lastVisitAt).toEqual(newDate);
      expect(ensureLastVisitAfterCreation).toHaveBeenCalled();
      expect(ensureDatesNotInFuture).toHaveBeenCalled();
    });
  });
});