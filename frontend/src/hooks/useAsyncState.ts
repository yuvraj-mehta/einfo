import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncStateReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
}

/**
 * Hook for managing async operations with loading, error, and data states
 */
export function useAsyncState<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = false,
): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        throw error;
      }
    },
    [asyncFunction],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

export default useAsyncState;
