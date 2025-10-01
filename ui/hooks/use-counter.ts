import { useState } from "react";

export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = (step: number = 1) => setCount((prev) => prev + step);
  const decrement = (step: number = 1) => setCount((prev) => prev - step);
  const reset = () => setCount(initialValue);

  const setValue = (value: number) => setCount(value);

  return { count, increment, decrement, setValue, reset };
}
