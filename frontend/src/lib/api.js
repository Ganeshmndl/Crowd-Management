const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
};

export { API_URL, apiRequest };
