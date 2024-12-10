import { hideLoader, showLoader } from "../redux/uiSlice";

export const apiClient = async (dispatch, url, method, options = {}) => {
  const base_url =
    import.meta.env.VITE_DEVELOPMENT_ENVIRONMENT === "true"
      ? import.meta.env.VITE_DEV_SERVER_BASE_URL
      : import.meta.env.VITE_PROD_SERVER_BASE_URL;

  try {
    // Show loader
    dispatch(showLoader());

    const response = await fetch(`${base_url}/${url}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // Rethrow to allow calling code to handle the error
  } finally {
    // Hide loader
    dispatch(hideLoader());
  }
};
