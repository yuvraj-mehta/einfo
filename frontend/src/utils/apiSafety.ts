/**
 * Safety wrapper for API calls to handle fetch errors gracefully
 */

export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallback?: T,
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    // Log errors at debug level to avoid console spam
    console.debug(
      "API call failed (expected in demo mode):",
      error?.message || "Unknown error",
    );

    // Return fallback if provided, otherwise null
    return fallback || null;
  }
};

export const isFetchError = (error: any): boolean => {
  return (
    error instanceof TypeError &&
    (error.message.includes("fetch") ||
      error.message.includes("Failed to fetch"))
  );
};

export const isNetworkError = (error: any): boolean => {
  return (
    isFetchError(error) ||
    error?.name === "AbortError" ||
    error?.message?.includes("network") ||
    error?.message?.includes("NETWORK_ERROR") ||
    error?.code === "NETWORK_ERROR"
  );
};
