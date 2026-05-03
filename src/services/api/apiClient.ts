import { auth } from "../../../config/FirebaseConfig";
import { API_CONFIG } from "../../../config/api";
import useAuthStore from "../../store/useAuthStore";

const BASE_API_URL = API_CONFIG.BASE_URL;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    useAuthStore.getState().logOut();
    throw new Error("Not Authenticated");
  }
  const token = await user?.getIdToken();

  const response = await fetch(`${BASE_API_URL}/api/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    useAuthStore.getState().logOut();
    throw new Error("Session expired, Please login again");
  }

  if (!response.ok) {
    let message; //"Request failed"
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}
