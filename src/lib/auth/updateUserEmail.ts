import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";

export const updateUserEmail = async (newEmail: string, password: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in!");

  await user.getIdToken(true);
  await user.reload();
  if (!user.emailVerified) {
    await sendEmailVerification(user);
    throw new Error(
      "Please verify your current email address before updating it. A verification link has been sent.",
    );
  }

  if (!newEmail || newEmail.trim() === "") {
    throw new Error("Email cannot be empty!");
  }
  if (!password) throw new Error("Password is needed for security reasons!");

  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    await verifyBeforeUpdateEmail(user, newEmail);
    return true;
  } catch (error) {
    console.log("Error updating email!", error);
    throw error;
  }
};
