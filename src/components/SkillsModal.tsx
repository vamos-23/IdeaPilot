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
import useThemeStore from "../store/useThemeStore";
import TechStackContent from "./techStackContent";

type SkillsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SkillsModal({ visible, onClose }: SkillsModalProps) {
  const { theme } = useThemeStore();
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
                  stroke={theme === "light" ? "red" : "#fff"}
                  strokeWidth={sc(2)}
                />
              </TouchableOpacity>
            </View>
            <TechStackContent />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
