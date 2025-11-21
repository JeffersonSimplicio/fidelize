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
  });
});