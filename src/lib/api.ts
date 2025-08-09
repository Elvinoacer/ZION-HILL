export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } catch (jsonError) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle cases where the response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    } else {
      // If not JSON, return as text or handle as needed.
      // For now, if it's not JSON, we'll assume it's a successful non-JSON response
      // and return an empty object or null, depending on expected type T.
      // A more robust solution might check T and return accordingly.
      return {} as T; // Or null as T, or throw an error if JSON is always expected
    }
  } catch (error: any) {
    // Network errors or errors thrown by response.json()
    throw new Error(error.message || "An unexpected network error occurred.");
  }
}
