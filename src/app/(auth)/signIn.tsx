import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import ThemeToggleButton from "@/src/components/ThemeToggle";
import FormLayout from "@/src/components/FormLayout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/FirebaseConfig";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "@/src/constants/formStyles";
import { vs } from "@/src/constants/responsive";
import { useCallback, useMemo } from "react";

type SignInFormFields = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const handleSignIn = useCallback(async (data: SignInFormFields) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("Signed in successfully!");
    } catch (error: any) {
      console.log("Error signing in user!", error.message);
    }
  }, []);
  const fields = useMemo(
    () => [
      {
        name: "email" as keyof SignInFormFields,
        placeholder: "Enter your email",
        rules: {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid Email",
          },
        },
      },
      {
        name: "password" as keyof SignInFormFields,
        placeholder: "Enter your password",
        secureTextEntry: true,
        rules: {
          required: "Password is required",
          pattern: {
            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            message:
              "Must have 1 uppercase, 1 number, 1 special character, min 8 chars",
          },
        },
      },
    ],
    []
  );
  return (
    <>
      <StatusBar style="auto" />
      <View className="flex-1 bg-brandLight dark:bg-brandDark">
        <KeyboardAwareScrollView
          contentContainerStyle={styles.overView}
          enableOnAndroid={true}
          extraScrollHeight={vs(15)}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
        >
          <ThemeToggleButton />
          <IdeaPilotLogo />
          <Text
            style={styles.title}
            className="dark:text-white font-nata-sans-bold"
          >
            IdeaPilot
          </Text>
          <Text
            style={styles.caption}
            className="text-textLight dark:text-textDark font-medium"
          >
            AI-powered project discovery for developers
          </Text>
          <View
            style={styles.container}
            className="border-gray-50 dark:border-gray-600 bg-brandLight dark:bg-formContainer elevation-xl dark:elevation-none"
          >
            <View style={styles.centerContent}>
              <FormLayout<SignInFormFields>
                title="Welcome Back!"
                description="Enter your password to continue"
                buttonText="Sign In"
                onSubmit={handleSignIn}
                forgotPassWord="Forgot your password?"
                fields={fields}
                userFormPromptText="Don't have an account?"
                formActionText="Sign Up"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}
