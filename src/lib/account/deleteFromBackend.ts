import { auth } from "../../../config/FirebaseConfig";
const API_BASE_URL = "https://DELETION_API_URL";//to be replaced with actual backend url

export default async function deleteFromBackend() {
  const user = auth.currentUser;
  if (!user) throw new Error("No user found!");
  const token = await user.getIdToken(true);
  const res = await fetch(`${API_BASE_URL}:/api/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Account deletion failed");
  }
}
