import AccountSettings from "@/src/components/AccountSettings";
import ChangePasswordModal from "@/src/components/ChangePasswordModal";
import ConfirmPasswordModal from "@/src/components/ConfirmPasswordModal";
import EditProfilePopup from "@/src/components/EditProfilePopup";
import EmailInputPopup from "@/src/components/EmailInputPopup";
import Logout from "@/src/components/Logout";
import NameInputPopup from "@/src/components/NameInputPopup";
import ProfileInfo from "@/src/components/ProfileInfo";
import SkillsInfo from "@/src/components/SkillsInfo";
import SkillsModal from "@/src/components/SkillsModal";
import ThemeSettings from "@/src/components/ThemeSettings";
import { auth } from "@/config/FirebaseConfig";
import performAccountDeletion from "../../../lib/account/performAccountDeletion";
import updateUserEmail from "@/src/lib/auth/updateUserEmail";
import useAuthStore from "@/src/store/useAuthStore";
import useProjectStore from "@/src/store/useProjectStore";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import { useIdeas } from "@/src/store/useIdeas";
import { updatePassword, signOut } from "firebase/auth";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { sc } from "./../../../constants/responsive";
import { FLOATING_TAB_BAR_HEIGHT } from "@/src/constants/tabBarHeight";
import performPasswordReset from "@/src/lib/account/performPasswordReset";
import { EMAIL_REGEX } from "@/src/constants/auth";

export default function Settings() {
  const appTheme = useThemeStore((s) => s.theme);

  const userEmail = useAuthStore((s) => s.user?.userEmail);
  const logOut = useAuthStore((s) => s.logOut);
  const clearLocalSkills = useSkillStore((s) => s.clearLocalSkills);
  const clearProjects = useProjectStore((s) => s.clearProjects);
  const clearIdeas = useIdeas((s) => s.clearIdeas);
  const clearPreference = useThemeStore((s) => s.clearPreference);

  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPasswordVerification, setShowPasswordVerification] =
    useState(false);
  const [showDeleteVerification, setShowDeleteVerification] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { top, bottom } = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearLocalSkills();
      clearProjects();
      clearIdeas();
      clearPreference();
      logOut();
    } catch {
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "There was an issue signing you out. Please try again.",
        topOffset: sc(45),
      });
    }
  };

  const confirmLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  const handlePendingEmail = (newEmail: string) => {
    const emailStr = newEmail.toLowerCase().trim();
    if (emailStr === userEmail?.toLowerCase()) {
      Toast.show({
        type: "info",
        text1: "Email Status",
        text2: "Email is already in use.",
        topOffset: sc(45),
      });
      return;
    }
    if (!EMAIL_REGEX.test(emailStr)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email!",
        text2: "Please enter valid email address.",
        topOffset: sc(45),
      });
      return;
    }
    setPendingEmail(newEmail);
    setShowEmailPopup(false);
    setShowEmailVerification(true);
  };

  const handleEmailUpdate = async () => {
    await updateUserEmail(pendingEmail);

    Toast.show({
      type: "success",
      text1: "Verification Email Sent",
      text2: "Please verify your new email address.",
      topOffset: sc(45),
    });
  };

  const handlePasswordReset = async (email: string) => {
    await performPasswordReset(email, () => setShowResetPasswordModal(false));
  };

  const handlePasswordUpdate = async (newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user.");
    }
    await updatePassword(currentUser, newPassword);
  };

  const handleDelete = async () => {
    await performAccountDeletion();
  };

  return (
    <View
      className="flex-1 bg-brandLight dark:bg-brandDark"
      style={{
        paddingTop: top + 20,
        paddingBottom: bottom,
      }}
    >
      <View className="px-6 mb-3 gap-y-1 w-full">
        <Text
          className="text-textLight dark:text-white font-nata-sans-bold"
          style={styles.title}
        >
          Settings
        </Text>
        <Text
          className="text-slate-500 dark:text-slate-400 font-nata-sans-medium"
          style={styles.subtitle}
        >
          Manage your account settings and preferences
        </Text>
      </View>

      <ScrollView
        className="px-6 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: bottom + FLOATING_TAB_BAR_HEIGHT + 12,
        }}
      >
        <ProfileInfo onEditProfile={() => setShowEditPopup(true)} />
        <SkillsInfo onClick={() => setShowSkillsModal(true)} />
        <ThemeSettings />
        <Logout appTheme={appTheme} onLogout={confirmLogout} />

        <AccountSettings
          appTheme={appTheme}
          onResetPassword={() => setShowResetPasswordModal(true)}
          onChangePassword={() => setShowPasswordVerification(true)}
          onDeleteAccount={() =>
            Alert.alert(
              "Delete Account",
              "Are you sure you want to permanently delete your account? This action cannot be undone.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Continue",
                  style: "destructive",
                  onPress: () => setShowDeleteVerification(true),
                },
              ],
            )
          }
        />
      </ScrollView>

      {showSkillsModal && (
        <SkillsModal
          visible={showSkillsModal}
          onClose={() => setShowSkillsModal(false)}
          appTheme={appTheme}
        />
      )}

      {showEditPopup && (
        <EditProfilePopup
          appTheme={appTheme}
          onClose={() => setShowEditPopup(false)}
          onEditName={() => {
            setShowEditPopup(false);
            setShowNamePopup(true);
          }}
          onEditEmail={() => {
            setShowEditPopup(false);
            setShowEmailPopup(true);
          }}
        />
      )}

      {showNamePopup && (
        <NameInputPopup
          appTheme={appTheme}
          onClose={() => {
            setShowNamePopup(false);
            setShowEditPopup(true);
          }}
          action={() => {
            setShowNamePopup(false);
            setShowEditPopup(true);
          }}
        />
      )}

      {showEmailPopup && (
        <EmailInputPopup
          appTheme={appTheme}
          title="Email Verification"
          placeholderText="Enter new email"
          buttonText="Proceed"
          onClose={() => {
            setShowEmailPopup(false);
            setShowEditPopup(true);
          }}
          action={handlePendingEmail}
        />
      )}

      {showEmailVerification && (
        <ConfirmPasswordModal
          visible={showEmailVerification}
          appTheme={appTheme}
          title="Verify Identity"
          description="Enter your current password to update your email address."
          confirmButtonText="Continue"
          loadingText="Verifying..."
          onClose={() => setShowEmailVerification(false)}
          onAuthenticated={handleEmailUpdate}
        />
      )}

      {showPasswordVerification && (
        <ConfirmPasswordModal
          visible={showPasswordVerification}
          appTheme={appTheme}
          title="Verify Identity"
          description="Enter your current password before changing it."
          confirmButtonText="Continue"
          loadingText="Verifying..."
          onClose={() => setShowPasswordVerification(false)}
          onAuthenticated={async () => {
            setShowPasswordVerification(false);
            setTimeout(() => {
              setShowChangePasswordModal(true);
            }, 150);
          }}
        />
      )}

      {showResetPasswordModal && (
        <EmailInputPopup
          appTheme={appTheme}
          title="Email Verification"
          placeholderText="Enter your email"
          buttonText="Send Reset Link"
          onClose={() => {
            setShowResetPasswordModal(false);
          }}
          action={handlePasswordReset}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          visible={showChangePasswordModal}
          appTheme={appTheme}
          onClose={() => setShowChangePasswordModal(false)}
          onSubmit={handlePasswordUpdate}
        />
      )}

      {showDeleteVerification && (
        <ConfirmPasswordModal
          visible={showDeleteVerification}
          appTheme={appTheme}
          title="Delete Account"
          description="Enter your current password to permanently delete your account."
          confirmButtonText="Delete Account"
          loadingText="Deleting..."
          onClose={() => setShowDeleteVerification(false)}
          onAuthenticated={handleDelete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: sc(28),
  },

  subtitle: {
    fontSize: sc(13),
  },
});
