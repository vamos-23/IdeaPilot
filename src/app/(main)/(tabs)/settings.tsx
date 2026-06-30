import AccountSettings from "@/src/components/AccountSettings";
import EditProfilePopup from "@/src/components/EditProfilePopup";
import EmailInputPopup from "@/src/components/EmailInputPopup";
import Logout from "@/src/components/Logout";
import NameInputPopup from "@/src/components/NameInputPopup";
import PasswordInputPopup from "@/src/components/PasswordInputPopup";
import ProfileInfo from "@/src/components/ProfileInfo";
import SkillsInfo from "@/src/components/SkillsInfo";
import SkillsModal from "@/src/components/SkillsModal";
import ThemeSettings from "@/src/components/ThemeSettings";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { sc, vs } from "./../../../constants/responsive";
import { auth } from "@/config/FirebaseConfig";
import { signOut } from "firebase/auth";
import useAuthStore from "@/src/store/useAuthStore";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import Toast from "react-native-toast-message";

export default function Settings() {
  const appTheme = useThemeStore((s) => s.theme);
  const logOut = useAuthStore((s) => s.logOut);
  const clearLocalSkills = useSkillStore((s) => s.clearLocalSkills);

  const [showPopup, setShowPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearLocalSkills();
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
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: handleLogout },
    ]);
  };

  const handleOpen = (popup: string) => {
    switch (popup) {
      case "Edit Popup":
        setShowPopup(true);
        break;
      case "Name Popup":
        setShowPopup(false);
        setShowNamePopup(true);
        break;
      case "Email Popup":
        setShowPopup(false);
        setShowEmailPopup(true);
        break;
      case "Password Popup":
        setShowPopup(false);
        setShowPasswordPopup(true);
        break;
    }
  };

  const handleClose = (popup: string) => {
    switch (popup) {
      case "Edit Profile Popup":
        setShowPopup(false);
        break;
      case "Name Popup":
        setShowNamePopup(false);
        setShowPopup(true);
        break;
      case "Email Popup":
        setShowEmailPopup(false);
        setShowPopup(true);
        break;
      case "Password Popup":
        setShowPasswordPopup(false);
        setShowEmailPopup(true);
        break;
    }
  };

  const handleCloseAfterAction = (popup: string) => {
    switch (popup) {
      case "Close Name Popup":
        setShowNamePopup(false);
        setShowPopup(true);
        break;
      case "Close Email Update Popup":
        setShowPasswordPopup(false);
        setShowPopup(true);
        break;
    }
  };

  const handlePendingEmail = (newEmail: string) => {
    setShowEmailPopup(false);
    setPendingEmail(newEmail);
    setShowPasswordPopup(true);
  };

  return (
    <View className="flex-1 bg-brandLight dark:bg-brandDark">
      <View className="px-6 mt-10 mb-5 gap-y-1 w-full">
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
        className="px-6"
        contentContainerStyle={{ alignItems: "center", paddingBottom: vs(85) }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileInfo onEditProfile={() => handleOpen("Edit Popup")} />
        <SkillsInfo onClick={() => setShowModal(true)} />
        <ThemeSettings />
        <Logout onLogout={confirmLogout} appTheme={appTheme} />
        <AccountSettings appTheme={appTheme} />
      </ScrollView>
      {showModal && (
        <SkillsModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          appTheme={appTheme}
        />
      )}

      {showPopup && (
        <EditProfilePopup
          onClose={() => handleClose("Edit Profile Popup")}
          onEditName={() => handleOpen("Name Popup")}
          onEditEmail={() => handleOpen("Email Popup")}
          appTheme={appTheme}
        />
      )}
      {showNamePopup && (
        <NameInputPopup
          onClose={() => handleClose("Name Popup")}
          action={() => handleCloseAfterAction("Close Name Popup")}
          appTheme={appTheme}
        />
      )}
      {showEmailPopup && (
        <EmailInputPopup
          onClose={() => handleClose("Email Popup")}
          action={handlePendingEmail}
          appTheme={appTheme}
        />
      )}
      {showPasswordPopup && (
        <PasswordInputPopup
          onClose={() => handleClose("Password Popup")}
          action={() => handleCloseAfterAction("Close Email Update Popup")}
          pendingEmail={pendingEmail}
          appTheme={appTheme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: sc(28) },
  subtitle: { fontSize: sc(13) },
});
