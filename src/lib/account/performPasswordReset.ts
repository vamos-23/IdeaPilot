import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";
import Toast from "react-native-toast-message";
import { sc } from "../../constants/responsive";
import { Keyboard } from "react-native";

export default async function performPasswordReset(
  email: string,
  onComplete: () => void,
) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (e) {
    console.error("Password Reset Link error!", e);
  } finally {
    Toast.show({
      type: "info",
      text1: "Check Your Email",
      text2:
        "If an account with that email exists, a link will be sent to your inbox or spam folder.",
      topOffset: sc(45),
    });
    Keyboard.dismiss();
    onComplete();
  }
}
