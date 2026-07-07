import { Alert } from "react-native";
export const handleFirebaseAuthError = (error: any, router: any) => {
  switch (error.code) {
    case "auth/invalid-credential":
      Alert.alert("No account found", "Would you like to sign up?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Sign Up",
          onPress: () => router.replace("/(auth)/signUp"),
        },
      ]);
      break;
    case "auth/user-not-found":
      Alert.alert("No account found", "Would you like to sign up?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Sign Up",
          onPress: () => router.replace("/(auth)/signUp"),
        },
      ]);
      break;
    case "auth/email-already-in-use":
      Alert.alert("Account already exists", "Would you like to sign in?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Sign In",
          onPress: () => router.replace("/(auth)/signIn"),
        },
      ]);
      break;
    case "auth/wrong-password":
      Alert.alert("Incorrect Password", "Please try again.");
      break;
    case "auth/invalid-email":
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      break;
    case "auth/weak-password":
      Alert.alert("Weak Password", "Your password is too weak.");
      break;
    default:
      //Alert.alert("Error", "Something went wrong. Please try again.");
      console.log("Error :", error);
  }
};
