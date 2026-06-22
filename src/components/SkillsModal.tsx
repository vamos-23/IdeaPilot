import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { XCircle } from "lucide-react-native";
import { sc, vs } from "../constants/responsive";
import TechStackContent from "./techStackContent";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
import { syncSkills } from "../services/users/users.onboarding";
import useSkillStore from "../store/useSkillStore";
import useAuthStore from "../store/useAuthStore";
import Toast from "react-native-toast-message";

type SkillsModalProps = {
  visible: boolean;
  onClose: () => void;
  appTheme: string;
};

export default function SkillsModal({
  visible,
  onClose,
  appTheme,
}: SkillsModalProps) {
  const user = useAuthStore((s) => s.user);
  const updateTechStack = useAuthStore((s) => s.updateTechStack);
  const skills = useSkillStore((s) => s.skills);
  const toggleSync = useSkillStore((s) => s.toggleSync);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveSkills = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const result = await syncSkills(user.userId, skills);
      if (result.success) {
        toggleSync(true);
        updateTechStack(skills);
        onClose();
        Toast.show({
          type: "success",
          text1: "Tech Stack Updated",
          text2: "Your tech stack was updated successfully!",
          topOffset: sc(45),
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Oops!",
          text2: "We couldn't update your tech stack. Please try again later.",
          topOffset: sc(45),
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred.",
        topOffset: sc(45),
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        <View
          className="bg-[#EEF1F6] dark:bg-[#0c224b]"
          style={{
            height: "87%",
            borderTopLeftRadius: sc(18),
            borderTopRightRadius: sc(18),
            overflow: "hidden",
            padding: sc(14),
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: vs(14),
            }}
          >
            <View className="flex-row justify-between px-2 items-center">
              <Text
                className="text-black dark:text-white font-nata-sans-bold px-2"
                style={{ fontSize: sc(23) }}
              >
                Manage Skills
              </Text>
              <TouchableOpacity onPress={onClose}>
                <XCircle
                  stroke={appTheme === "light" ? "red" : "#fff"}
                  strokeWidth={sc(2)}
                />
              </TouchableOpacity>
            </View>
            <TechStackContent />
            <SubmitButton
              buttonText="Save"
              loadingText="Saving..."
              isLoading={isSaving}
              isDisabled={isSaving}
              onSubmit={handleSaveSkills}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
