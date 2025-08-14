import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import IdeaPilotLogo from "@/components/IdeaPilotLogo";
import ThemeToggleButton from "@/components/ThemeToggle";
import FormLayout from "@/components/FormLayout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "@/constants/formStyles";
import { vs } from "@/constants/responsive";

type SignInFormFields = {
  email?: string;
  password: string;
};
const handleSignIn = () => {
  //replace by firebase auth logic for sign in
  console.log("Signed in!");
};

export default function SignInScreen() {
  return (
    <>
      <StatusBar style="auto" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.overView}
        enableOnAndroid={true}
        extraScrollHeight={vs(20)}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
      >
          <ThemeToggleButton />
        <IdeaPilotLogo />
        <Text style={styles.title}>IdeaPilot</Text>
        <Text style={styles.caption} className="text-formTextLight">
          AI-powered project discovery for developers
        </Text>
        <View
          style={[styles.container, styles.shadow]}
          className="border-gray-50 bg-brandLight"
        >
          <View style={styles.centerContent}>
            <FormLayout<SignInFormFields>
              title="Welcome Back"
              description="Enter your password to continue"
              buttonText="Sign In"
              onSubmit={handleSignIn}
              forgotPassWord="Forgot your password?"
              fields={[
                {
                  name: "password",
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
              ]}
              userFormPromptText="Don't have an account?"
              formActionText="Sign Up"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
