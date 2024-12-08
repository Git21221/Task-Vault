const base_url =
  import.meta.env.VITE_DEVELOPMENT_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER_BASE_URL
    : import.meta.env.VITE_PROD_SERVER_BASE_URL;
export const apiClient = async (url, method, options) => {
  try {
    const response = await fetch(`${base_url}/${url}`, {
      method,
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
