import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";
import useAuthStore from "../../store/useAuthStore";

export const updateUserEmail = async (newEmail: string, password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in!");
  if (!newEmail || newEmail.trim() === "") {
    throw new Error("Email cannot be empty!");
  }
  if (!password) throw new Error("Password is needed for security reasons!");
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
    await sendEmailVerification(user).then(() => {
      console.log("Email verification link sent!");
    });
    useAuthStore.getState().logIn({
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
    });
    return true;
  } catch (error) {
    console.log("Error updating email!");
    throw error;
  }
};
