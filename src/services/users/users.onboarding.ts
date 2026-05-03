import Skill from "../../constants/types";
import { apiFetch } from "../api/apiClient";
interface SyncBackend {
  success: boolean;
  message?: string;
}
export async function syncSkills(skills: Skill[]): Promise<SyncBackend> {
  const data = await apiFetch<SyncBackend>("/users/skills", {
    method: "POST",
    body: JSON.stringify({
      skills,
    }),
  });

  return data;
}
