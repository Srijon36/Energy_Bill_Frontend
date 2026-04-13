import axios from "axios";

// ✅ Use correct env variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ Routes that use FormData (file uploads)
const formDataURLs = [
  "/uploads/upload-bill",
];

api.interceptors.request.use(
  (req) => {
    // ── Token ─────────────────────────────
    let token = null;
    try {
      const stored = sessionStorage.getItem("energy_token");
      const parsed = stored ? JSON.parse(stored) : null;
      token = parsed?.token || null;
    } catch {
      token = null;
    }

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // ── Content-Type ──────────────────────
    const isFormData = formDataURLs.some((url) =>
      req.url?.startsWith(url)
    );

    if (isFormData) {
      // Let browser set multipart boundary
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