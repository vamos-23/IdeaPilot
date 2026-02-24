import { router } from "expo-router";
import deleteFromBackend from "./deleteFromBackend";
import isRecentlyAuthenticated from "./isRecentlyAuthenticated";

export default async function handleDeleteAccount() {
  if (!isRecentlyAuthenticated()) {
    router.replace("/(auth)/signIn?afterReauth=delete");
    return;
  }
  await deleteFromBackend();
}
