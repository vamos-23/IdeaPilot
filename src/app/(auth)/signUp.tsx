import { auth } from "@/config/FirebaseConfig";
import FormLayout from "@/src/components/FormLayout";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import ThemeToggleButton from "@/src/components/ThemeToggle";
import { styles } from "@/src/constants/formStyles";
import { vs } from "@/src/constants/responsive";
import { handleFirebaseAuthError } from "@/src/lib/auth/authErrorHandler";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useCallback, useMemo, useState } from "react";
import { Keyboard, Text, View, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type SignUpFormFields = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setButtonLoading] = useState<boolean>(false);
  const handleSignUp = useCallback(
    async (data: SignUpFormFields) => {
      setButtonLoading(true);
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const authUser = userCredentials.user;
        await updateProfile(authUser, { displayName: data.name });
        await sendEmailVerification(userCredentials.user);
        Alert.alert(
          "Verify your email",
          "A verification link has been sent to your email address. Please check your inbox (and spam folders too!) "
        );
        await new Promise((resolve) => setTimeout(resolve, 2500));
        console.log("User signed up!");
        console.log(authUser.displayName);
        console.log(authUser.email);
        console.log(authUser.uid);
      } catch (error: any) {
        handleFirebaseAuthError(error, router);
        Keyboard.dismiss();
      } finally {
        setButtonLoading(false);
      }
    },
    [router]
  );
  const fields = useMemo(
    () => [
      {
        name: "name" as keyof SignUpFormFields,
        placeholder: "Enter your Name/Username",
        rules: { required: "Username is required" },
      },
      {
        name: "email" as keyof SignUpFormFields,
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
        name: "password" as keyof SignUpFormFields,
        placeholder: "Enter your password",
        secureTextEntry: true,
        rules: {
          required: "Password is required",
          pattern: {
            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            message:
              "Must have 1 uppercase, 1 number, 1 special character, min 8 characters",
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
            Join IdeaPilot
          </Text>
          <Text
            style={styles.caption}
            className="text-formTextLight dark:text-formTextDark font-medium"
          >
            Start discovering projects tailored to your skills
          </Text>
          <View
            style={styles.container}
            className="border-gray-50 dark:border-gray-600 bg-brandLight dark:bg-formContainer elevation-xl dark:elevation-none"
          >
            <View style={styles.centerContent}>
              <FormLayout<SignUpFormFields>
                title="Create Account"
                description="Get personalized project recommendations"
                buttonText="Create Account"
                asyncButtonText="Signing Up..."
                onSubmit={handleSignUp}
                isButtonLoading={loading}
                fields={fields}
                userFormPromptText="Already have an account?"
                formActionText="Sign In"
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}
