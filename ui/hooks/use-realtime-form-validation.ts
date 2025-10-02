import { useState, useEffect } from "react";
import { z, ZodError } from "zod";

export function useRealtimeFieldValidation<T>(
  schema: z.ZodType<T>,
  value: T,
  delay = 500
) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;

    const handler = setTimeout(() => {
      try {
        schema.parse(value);
        setError(null);
      } catch (err) {
        if (err instanceof ZodError) {
          setError(err.errors[0]?.message || "Valor inválido");
        }
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, schema, delay, touched]);

  return {
    error,
    touched,
    setTouched: () => setTouched(true),
  };
}
