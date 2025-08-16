import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IdeaPilotLogo from "@/components/IdeaPilotLogo";
import ThemeToggleButton from "@/components/ThemeToggle";
import FormLayout from "@/components/FormLayout";
import { styles } from "@/constants/formStyles";
import { vs } from "@/constants/responsive";

type SignUpFormFields = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpScreen() {
  const handleSignUp = () => {
    console.log("Signed up!");
  };

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
          <Text style={styles.title} className="dark:text-white font-nata-sans-bold">
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
                onSubmit={handleSignUp}
                fields={[
                  {
                    name: "name",
                    placeholder: "Enter your Name/Username",
                    rules: { required: "Username is required" },
                  },
                  {
                    name: "email",
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
                    name: "password",
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
                ]}
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
