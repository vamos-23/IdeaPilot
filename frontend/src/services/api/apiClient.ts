import { create } from "axios";
import { auth } from "@/config/FirebaseConfig";

export const apiClient = create({
  baseURL: "https://ideapilot-gz77.onrender.com/api",
});

apiClient.interceptors.request.use(
  async (config: any) => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
