import ButtonGroup from "@/src/components/ButtonGroup";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import UserIconLogo from "@/src/components/UserIconLogo";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import { Code, Rocket } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ms, sc, vs } from "../../constants/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompletionScreen() {
  const skills = useSkillStore((s) => s.skills);
  const appTheme = useThemeStore((s) => s.theme);
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="bg-brandLight dark:bg-brandDark flex-1"
      style={{
        paddingBottom: bottom,
      }}
    >
      <ScrollView
        contentContainerStyle={shapes.main}
        showsVerticalScrollIndicator={false}
        className="bg-brandLight dark:bg-brandDark flex-1"
      >
        <View
          style={shapes.container}
          className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none items-center w-full"
        >
          <UserIconLogo icon={<Rocket size={sc(45)} stroke="dodgerblue" />} />

          <Text
            style={shapes.titleMessage}
            className="text-textLight dark:text-white font-nata-sans-bold mt-4 mb-1"
          >
            Almost There!
          </Text>
          <Text
            style={shapes.subtitleMessage}
            className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-8 text-center"
          >
            One final step to complete your journey
          </Text>

          <IdeaPilotLogo />

          <Text
            style={shapes.titleMessage}
            className="text-textLight dark:text-white font-nata-sans-bold mt-4 mb-1"
          >
            Almost There! 🚀
          </Text>
          <View className="px-5 justify-center items-center mb-5 mt-2">
            <Text
              style={shapes.introMessage}
              className="text-slate-500 dark:text-textDark font-nata-sans-medium text-center"
            >
              {`Great! We've captured your ${skills.length} skills. Create your account to unlock personalized project suggestions.`}
            </Text>
          </View>

          <View
            style={shapes.selectedSkills}
            className="bg-brandLight dark:bg-brandDark border border-borderLight dark:border-borderDark flex-row flex-wrap p-4 justify-center gap-3 mb-3"
          >
            {skills.map((item) => (
              <View
                key={item.id}
                style={shapes.skillTag}
                className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark justify-center items-center flex-row gap-1.5"
              >
                <Code
                  size={sc(16)}
                  color={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                />
                <Text className="text-textLight dark:text-white font-nata-sans-bold">
                  {item.stackName}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <ButtonGroup nextRoute="/(auth)/signUp" />
      </ScrollView>
    </View>
  );
}

const shapes = StyleSheet.create({
  main: {
    padding: sc(25),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    marginTop: vs(45),
    padding: ms(17),
  },
  titleMessage: {
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
    borderRadius: sc(16),
  },
  skillTag: {
    borderRadius: sc(15),
    paddingVertical: vs(5),
    paddingHorizontal: sc(10),
  },
});
