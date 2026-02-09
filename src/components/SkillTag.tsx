import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { X, Code } from "lucide-react-native";
import { vs, sc } from "../constants/responsive";
import Skill from "../constants/types";
import useThemeStore from "../store/useThemeStore";
type SkillTagProps = {
  skill: Skill;
  isCancel: boolean;
  onRemove?: (id: string) => void;
};
export default function SkillTag({ skill, onRemove, isCancel }: SkillTagProps) {
  const { theme } = useThemeStore();
  return (
    <TouchableOpacity
      key={skill.id}
      style={shapes.skillTag}
      className="bg-[#e5e2e2] dark:bg-[#2a2a6ce4]"
      onPress={() => onRemove?.(skill.id)}
      activeOpacity={0.7}
    >
      <View className="justify-center items-center flex-row gap-3">
        <Code
          size={sc(16)}
          color={theme === "light" ? "orangered" : "#48C9B0"}
        />
        <Text className="text-black dark:text-white font-nata-sans-bold">
          {skill.stackName}
        </Text>
        {isCancel && (<X size={sc(15)} color={theme === "light" ? "crimson" : "red"} />)}
      </View>
    </TouchableOpacity>
  );
}
const shapes = StyleSheet.create({
  skillTag: {
    borderRadius: sc(15),
    paddingVertical: vs(5),
    padding: sc(10),
  },
});
