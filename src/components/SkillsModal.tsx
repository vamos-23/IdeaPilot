import { Modal, View, Text, TouchableWithoutFeedback } from "react-native";
type SkillsModalProps = {
  visible: boolean;
  onClose: () => void;
};
export default function SkillsModal({ visible, onClose }: SkillsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: 320,
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 20,
              }}
            >
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
