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
            IdeaPilot
          </Text>
          <Text
            style={styles.caption}
            className="text-formTextLight dark:text-formTextDark font-medium"
          >
            AI-powered project discovery for developers
          </Text>
          <View
           style={styles.container}
            className="border-gray-50 dark:border-gray-600 bg-brandLight dark:bg-formContainer elevation-xl dark:elevation-none"
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
      </View>
    </>
  );
}
