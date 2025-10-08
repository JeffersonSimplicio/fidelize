import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "points-asc"
  | "points-desc"
  | "createdAt-asc"
  | "createdAt-desc"
  | "lastVisitAt-asc"
  | "lastVisitAt-desc";

export function useCustomerSort() {
  const [sortOption, setSortOption] = useState<SortOption>("createdAt-desc");

  const sortCustomers = useCallback(
    (list: Customer[]) => {
      const sorted = [...list];
      switch (sortOption) {
        case "name-asc":
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case "points-asc":
          return sorted.sort((a, b) => a.points - b.points);
        case "points-desc":
          return sorted.sort((a, b) => b.points - a.points);
        case "createdAt-asc":
          return sorted.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        case "createdAt-desc":
          return sorted.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
        case "lastVisitAt-asc":
          return sorted.sort(
            (a, b) => a.lastVisitAt.getTime() - b.lastVisitAt.getTime()
          );
        case "lastVisitAt-desc":
          return sorted.sort(
            (a, b) => b.lastVisitAt.getTime() - a.lastVisitAt.getTime()
          );
        default:
          return sorted;
      }
    },
    [sortOption]
  );

  return {
    sortOption,
    setSortOption,
    sortCustomers,
  };
}