if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("API base URL not set in environment variables, using default");
}

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050",
  apiEndpoints: {
    requests: import.meta.env.VITE_API_REQUESTS_URL || "/api/requests",
    institutes: import.meta.env.VITE_API_INSTITUTES_URL || "/api/institutes",
  },
};
