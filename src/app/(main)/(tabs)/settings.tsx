import EditProfilePopup from "@/src/components/EditProfilePopup";
import EmailInputPopup from "@/src/components/EmailInputPopup";
import NameInputPopup from "@/src/components/NameInputPopup";
import Notifications from "@/src/components/Notifications";
import PasswordInputPopup from "@/src/components/PasswordInputPopup";
import ProfileInfo from "@/src/components/ProfileInfo";
import SkillsInfo from "@/src/components/SkillsInfo";
import SkillsModal from "@/src/components/SkillsModal";
import ThemeSettings from "@/src/components/ThemeSettings";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { sc, vs } from "./../../../constants/responsive";

export default function Settings() {
  const [showPopup, setShowPopup] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);

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
      default:
        return;
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
      default:
        return;
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
      default:
        return;
    }
  };

  // Email → Password re-auth flow
  const handlePendingEmail = (newEmail: string) => {
    setShowEmailPopup(false);
    setPendingEmail(newEmail);
    setShowPasswordPopup(true);
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="bg-brandLight dark:bg-[#011035] px-7"
        contentContainerStyle={{ alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="top-5 mb-16 gap-y-1">
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.title}
          >
            Settings
          </Text>
          <Text
            className="text-textLight dark:text-textDark font-semibold"
            style={styles.subtitle}
          >
            Manage your account settings and preferences
          </Text>
        </View>

        <ProfileInfo onEditProfile={() => handleOpen("Edit Popup")} />
        <SkillsInfo onClick={() => setShowModal(true)} />
        <ThemeSettings />
        <Notifications />
      </ScrollView>

      {showModal && (
        <SkillsModal visible={showModal} onClose={() => setShowModal(false)} />
      )}
      
      {showPopup && (
        <EditProfilePopup
          onClose={() => handleClose("Edit Profile Popup")}
          onEditName={() => handleOpen("Name Popup")}
          onEditEmail={() => handleOpen("Email Popup")}
        />
      )}

      {showNamePopup && (
        <NameInputPopup
          onClose={() => handleClose("Name Popup")}
          action={() => handleCloseAfterAction("Close Name Popup")}
        />
      )}

      {showEmailPopup && (
        <EmailInputPopup
          onClose={() => handleClose("Email Popup")}
          action={handlePendingEmail}
        />
      )}

      {showPasswordPopup && (
        <PasswordInputPopup
          onClose={() => handleClose("Password Popup")}
          action={() => handleCloseAfterAction("Close Email Update Popup")}
          pendingEmail={pendingEmail}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: sc(25),
  },
  subtitle: {
    fontSize: sc(12),
  },
  scrollView: {
    flexGrow: 1,
    padding: sc(23),
    marginBottom: vs(25),
    justifyContent: "center",
    alignItems: "center",
  },
});
