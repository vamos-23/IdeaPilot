import FormLayout from "@/src/components/FormLayout";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import { styles } from "@/src/constants/formStyles";
import { vs } from "@/src/constants/responsive";
import { useRouter, useLocalSearchParams } from "expo-router";
import handleDeleteAccount from "@/src/lib/account/handleDeleteAccount";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useMemo, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth } from "../../../config/FirebaseConfig";
import { handleFirebaseAuthError } from "../../lib/auth/authErrorHandler";
import useAuthStore from "@/src/store/useAuthStore";
import useSkillStore from "@/src/store/useSkillStore";
import { fetchUserSkills } from "@/src/services/users/users.onboarding";

type SignInFormFields = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const router = useRouter();
  const { afterReauth } = useLocalSearchParams();
  const [loading, setButtonLoading] = useState<boolean>(false);

  const setSkills = useSkillStore((s) => s.setSkills);
  const toggleSync = useSkillStore((s) => s.toggleSync);
  const logIn = useAuthStore((s) => s.logIn);
  const setOnboardingStatus = useAuthStore((s) => s.setOnboardingStatus);

  const handleSignIn = useCallback(
    async (data: SignInFormFields) => {
      setButtonLoading(true);
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        const authUser = userCredentials.user;
        const userSkills = await fetchUserSkills(authUser.uid);

        setSkills(userSkills);
        toggleSync(true);
        logIn({
          userId: authUser.uid,
          userEmail: authUser.email,
          userName: authUser.displayName || "Guest",
          techStack: userSkills,
        });
        setOnboardingStatus(true);

        console.log("Signed in successfully!");
        if (afterReauth === "delete") {
          await handleDeleteAccount();
        }
      } catch (error: any) {
        handleFirebaseAuthError(error, router);
        Keyboard.dismiss();
      } finally {
        setButtonLoading(false);
      }
    },
    [router, afterReauth, setSkills, toggleSync, logIn, setOnboardingStatus],
  );

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
    [],
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
          showsVerticalScrollIndicator={false}
        >
          <IdeaPilotLogo />

          <Text
            style={styles.title}
            className="text-textLight dark:text-white font-nata-sans-bold mt-4"
          >
            IdeaPilot
          </Text>
          <Text
            style={styles.caption}
            className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-6 text-center px-4"
          >
            AI-powered project discovery for developers
          </Text>

          <View
            style={styles.container}
            className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none w-full"
          >
            <View style={styles.centerContent} className="p-6">
              <FormLayout<SignInFormFields>
                title="Welcome Back!"
                description="Enter your password to continue"
                buttonText="Sign In"
                asyncButtonText="Signing in..."
                isButtonLoading={loading}
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
