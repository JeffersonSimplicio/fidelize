import { ensurePointsRequiredIsValid } from "@/core/domain/rewards/rules";
import { InvalidPointsRequiredError } from "@/core/domain/rewards/errors";

describe("ensurePointsRequiredIsValid", () => {
  it("should not throw when value is equal to minimum", () => {
    expect(() => ensurePointsRequiredIsValid(5, 5)).not.toThrow();
  });

  it("should not throw when value is greater than minimum", () => {
    expect(() => ensurePointsRequiredIsValid(10, 5)).not.toThrow();
  });

  it("should throw InvalidPointsRequiredError when value is less than minimum", () => {
    expect(() => ensurePointsRequiredIsValid(3, 5)).toThrow(InvalidPointsRequiredError);
  });
});
