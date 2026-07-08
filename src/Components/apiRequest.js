import axios from "axios";

// In-memory registry for deduplicating concurrent GET requests and caching responses
const pendingPromises = new Map();
const cache = new Map();
const CACHE_TTL = 2000; // Cache duration in milliseconds (2 seconds)

/**
 * Reusable API request helper with token authentication, request deduplication, and caching
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {Object|null} data - Request body data for POST/PUT/PATCH/DELETE
 * @param {Object} headers - Additional headers to merge with defaults
 * @returns {Promise<Object>} - Returns { success: boolean, data?: any, error?: string, status?: number }
 */
const apiRequest = async (url, method = "GET", data = null, headers = {}) => {
  const normalizedMethod = method.toUpperCase();
  const isGet = normalizedMethod === "GET";
  const cacheKey = `${normalizedMethod}_${url}_${data ? JSON.stringify(data) : ""}_${JSON.stringify(headers)}`;

  if (isGet) {
    // 1. Check if we have a fresh cached response
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.response;
    }

    // 2. Check if an identical request is already pending in the flight pool
    if (pendingPromises.has(cacheKey)) {
      return pendingPromises.get(cacheKey);
    }
  } else {
    // Clear cache on write operations (mutations) to guarantee subsequent requests get fresh data
    cache.clear();
  }

  const performRequest = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const config = {
        method: normalizedMethod,
        url,
        headers: { ...defaultHeaders, ...headers },
        validateStatus: () => true,
      };

      if (data && ["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) {
        config.data = data;
      }

      const response = await axios(config);

      let result;
      if (response.status >= 200 && response.status < 300) {
        result = {
          success: true,
          data: response.data,
          status: response.status,
        };
      } else {
        const backendError = response.data?.error || response.data?.message;
        result = {
          success: false,
          error: backendError || `Request failed (${response.status})`,
          status: response.status,
          data: response.data,
        };
      }

      // Cache successful GET responses
      if (isGet && result.success) {
        cache.set(cacheKey, {
          response: result,
          timestamp: Date.now(),
        });
      }

      return result;
    } catch (error) {
      console.error("Network or unexpected error:", error);
      return {
        success: false,
        error: "Network error or unexpected issue occurred.",
        networkError: true,
      };
    } finally {
      if (isGet) {
        pendingPromises.delete(cacheKey);
      }
    }
  };

  if (isGet) {
    const promise = performRequest();
    pendingPromises.set(cacheKey, promise);
    return promise;
  }

  return performRequest();
};

export default apiRequest;
