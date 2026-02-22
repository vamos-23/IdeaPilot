import { auth } from "../../../config/FirebaseConfig";
import { router } from "expo-router";
import isRecentlyAuthenticated from "./isRecentlyAuthenticated";
import deleteFromBackend from "./deleteFromBackend";

export default async function handleDeleteAccount() {
  const user = auth.currentUser;
  if (!user || !isRecentlyAuthenticated()) {
    router.replace("/(auth)/signIn?afterReauth=delete");
    return;
  }
  await deleteFromBackend();
}
