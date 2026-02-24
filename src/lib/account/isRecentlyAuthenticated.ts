import { auth } from "@/config/FirebaseConfig";

export default function isRecentlyAuthenticated(): boolean {
  const user = auth.currentUser;
  const lastSignInTime = user?.metadata?.lastSignInTime;
  if (!lastSignInTime) return false;
  const lastSignIn = new Date(lastSignInTime).getTime();
  //window for checking whether session is older than 5 minutes or not
  return Date.now() - lastSignIn < 5 * 60 * 1000;
}
