import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error("❌ API URL is missing in .env");
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const formDataURLs = ["/uploads/upload-bill"];

api.interceptors.request.use(
  (req) => {
    // 🔐 Token
    try {
      const stored = sessionStorage.getItem("energy_token");
      const parsed = stored ? JSON.parse(stored) : null;
      const token = parsed?.token;

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}

    // 📦 Content-Type
    const isFormData = formDataURLs.some((url) =>
      req.url?.includes(url)
    );

    if (isFormData) {
      delete req.headers["Content-Type"];
    } else {
      req.headers["Content-Type"] = "application/json";
    }

    return req;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("energy_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;