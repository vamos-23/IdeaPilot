import { auth } from "@/config/FirebaseConfig";
import FormLayout from "@/src/components/FormLayout";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import { styles } from "@/src/constants/formStyles";
import { vs } from "@/src/constants/responsive";
import { handleFirebaseAuthError } from "@/src/lib/auth/authErrorHandler";
import useAuthStore from "@/src/store/useAuthStore";
import useSkillStore from "@/src/store/useSkillStore";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useCallback, useMemo, useState } from "react";
import { Alert, Keyboard, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { syncSkills } from "../../services/users/users.onboarding";

type SignUpFormFields = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const setOnboardingStatus = useAuthStore((s) => s.setOnboardingStatus);
  const logIn = useAuthStore((s) => s.logIn);
  const skills = useSkillStore((s) => s.skills);
  const toggleSync = useSkillStore((s) => s.toggleSync);
  const [loading, setButtonLoading] = useState<boolean>(false);

  const handleSignUp = useCallback(
    async (data: SignUpFormFields) => {
      setButtonLoading(true);
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        const authUser = userCredentials.user;
        await updateProfile(authUser, { displayName: data.name });
        await authUser.reload();
        await sendEmailVerification(authUser);
        console.log(skills);
        const result = await syncSkills(authUser.uid, skills);
        if (result.success) {
          logIn({
            userId: authUser.uid,
            userEmail: authUser.email,
            userName: authUser.displayName || data.name,
            techStack: skills,
          });
          toggleSync(true);
          setOnboardingStatus(true);
          Alert.alert(
            "Verify your email",
            "A verification link has been sent to your email address. Please check your inbox (and spam folders too!) ",
          );
        } else {
          logIn({
            userId: authUser.uid,
            userEmail: authUser.email,
            userName: authUser.displayName || data.name,
            techStack: skills,
          });
          setOnboardingStatus(true);
          Alert.alert(
            "Profile Error",
            "Account created, but we couldn't back up your skills. You can retry syncing in your Settings screen.",
          );
        }
      } catch (error: any) {
        handleFirebaseAuthError(error, router);
        Keyboard.dismiss();
      } finally {
        setButtonLoading(false);
      }
    },
    [router, skills, toggleSync, setOnboardingStatus, logIn],
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
            Join IdeaPilot
          </Text>
          <Text
            style={styles.caption}
            className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-6 text-center px-4"
          >
            Start discovering projects tailored to your skills
          </Text>

          <View
            style={styles.container}
            className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none w-full"
          >
            <View style={styles.centerContent} className="p-6">
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
