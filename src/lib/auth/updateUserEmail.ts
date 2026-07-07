import { sendEmailVerification, verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";

export default async function updateUserEmail(newEmail: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user.");
  }
  await user.reload();

  if (!user.emailVerified) {
    await sendEmailVerification(user);
    throw new Error(
      "Please verify your current email before changing it. A verification email has been sent.",
    );
  }

  const trimmedEmail = newEmail.trim();
  if (!trimmedEmail) {
    throw new Error("Email cannot be empty.");
  }
  await verifyBeforeUpdateEmail(user, trimmedEmail);
}
