import { View, Text, ScrollView, StyleSheet } from "react-native";
import { sc, ms, vs } from "../../constants/responsive";
import ThemeToggleButton from "@/src/components/ThemeToggle";
import UserIconLogo from "@/src/components/UserIconLogo";
import { Rocket, Code } from "lucide-react-native";
import ButtonGroup from "@/src/components/ButtonGroup";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import useAuthStore from "@/src/store/useAuthStore";
export default function CompletionScreen() {
  const { skills } = useSkillStore();
  const { theme } = useThemeStore();
  const { completeOnboarding } = useAuthStore();
  return (
    <ScrollView
      contentContainerStyle={shapes.main}
      showsVerticalScrollIndicator={false}
      className="bg-brandLight dark:bg-brandDark flex-1"
    >
      <ThemeToggleButton />
      <View
        style={shapes.welcomeContainer}
        className="border-gray-300 dark:border-blue-600 bg-brandLight
        dark:bg-[#111111de] items-center elevation-lg dark:elevation-none"
      >
        <UserIconLogo icon={<Rocket size={sc(45)} stroke="dodgerblue" />} />
        <Text
          style={shapes.welcomeMessage}
          className="font-nata-sans-bold dark:text-white mb-1"
        >
          Almost There!
        </Text>
        <Text
          style={shapes.subtitleMessage}
          className="text-textLight dark:text-textDark font-medium mb-8"
        >
          One final step to complete your journey
        </Text>
        <IdeaPilotLogo />
        <Text
          style={shapes.welcomeMessage}
          className="font-nata-sans-bold dark:text-white mt-4 mb-1"
        >
          Almost There! 🚀
        </Text>
        <View className="px-5 justify-center items-center mb-5">
          <Text
            style={shapes.introMessage}
            className="text-textLight dark:text-textDark font-medium mb-3"
          >
            {`Great! We've captured your ${skills.length} skills. Create your account to unlock personalized project suggestions.`}
          </Text>
        </View>
        <View
          style={shapes.selectedSkills}
          className="bg-[#e5e8ee] dark:bg-[#121519] border-[#d6dae3] dark:border-[#4a5057] flex-row flex-wrap p-4 justify-center gap-3 mb-3"
        >
          {skills.map((item) => (
            <View
              key={item.id}
              style={shapes.skillTag}
              className="bg-[#f9fafc] dark:bg-[#2a2a6ce4] 
              border-[#d6dae3] dark:border-[#212427] justify-center items-center flex-row gap-1.5"
            >
              <Code
                size={sc(16)}
                color={theme === "light" ? "orangered" : "#48C9B0"}
              />
              <Text className="text-black dark:text-white font-nata-sans-bold">
                {item.stackName}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <ButtonGroup nextRoute="/(auth)/signUp" />
    </ScrollView>
  );
}
const shapes = StyleSheet.create({
  main: {
    padding: sc(25),
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    width: "100%",
    marginTop: vs(45),
    padding: ms(17),
    borderRadius: sc(17),
    borderWidth: sc(2),
  },
  welcomeMessage: {
    fontSize: ms(25),
  },
  subtitleMessage: {
    fontSize: ms(14),
  },
  introMessage: {
    fontSize: ms(15),
  },
  selectedSkills: {
    width: "94%",
    borderRadius: sc(12),
    borderWidth: sc(2),
  },
  skillTag: {
    borderRadius: sc(15),
    borderWidth: sc(1.2),
    paddingVertical: vs(5),
    padding: sc(10),
  },
});
