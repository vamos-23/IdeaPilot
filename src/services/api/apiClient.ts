import { create } from "axios";
import { auth } from "@/config/FirebaseConfig";

export const apiClient = create({
  baseURL: "http://192.168.1.12:3000/api/chats", //to be replaced with Render Deployed URL
  timeout: 12000,
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
