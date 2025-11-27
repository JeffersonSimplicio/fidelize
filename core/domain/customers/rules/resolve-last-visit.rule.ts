export function resolveLastVisit(
  currentPoints: number,
  newPoints: number | undefined,
  currentLastVisit: Date,
  newLastVisit?: Date,
): Date {
  if (newLastVisit) return newLastVisit;

  if (newPoints !== undefined && newPoints > currentPoints) return new Date();

  return currentLastVisit;
}
