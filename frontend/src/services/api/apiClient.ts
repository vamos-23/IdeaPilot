import { create } from "axios";
import { auth } from "@/config/FirebaseConfig";
import Constants from "expo-constants";

export const apiClient = create({
  baseURL: Constants.expoConfig?.extra?.API_URL,
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
