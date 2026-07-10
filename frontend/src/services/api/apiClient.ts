import { create } from "axios";
import { auth } from "@/config/FirebaseConfig";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 15000
});

apiClient.interceptors.request.use(
  async (config: any) => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
