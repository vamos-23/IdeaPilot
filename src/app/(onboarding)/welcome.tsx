import ButtonGroup from "@/src/components/ButtonGroup";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import InfoCard from "@/src/components/InfoCard";
import UserIconLogo from "@/src/components/UserIconLogo";
import { Code, Sparkles, Target, User } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ms, sc, vs } from "../../constants/responsive";

export default function WelcomeScreen() {
  const inputSkills = {
    icon: <Code size={sc(35)} color="teal" />,
    title: "Input Skills",
    description: "Tell us what you know",
  };
  const aiAnalysis = {
    icon: <Sparkles size={sc(35)} color="#930dc5" />,
    title: "AI Analysis",
    description: "We analyze your stack",
  };
  const getProjects = {
    icon: <Target size={sc(35)} color="#0ecd11" />,
    title: "Get Projects",
    description: "Discover perfect matches",
  };
  return (
    <ScrollView
      contentContainerStyle={shapes.main}
      className="bg-brandLight dark:bg-brandDark flex-1"
    >
      <View
        style={shapes.welcomeContainer}
        className="border-gray-300 dark:border-blue-600 bg-brandLight
        dark:bg-[#111111de] items-center elevation-lg dark:elevation-none"
      >
        <UserIconLogo icon={<User size={sc(45)} stroke="dodgerblue" />} />
        <Text
          style={shapes.welcomeMessage}
          className="font-nata-sans-bold dark:text-white"
        >
          Welcome to IdeaPilot!
        </Text>
        <Text
          style={shapes.subtitleMessage}
          className="text-textLight dark:text-textDark font-medium mb-5"
        >
          Let&apos;s personalize your experience!
        </Text>
        <IdeaPilotLogo />
        <Text
          style={shapes.welcomeMessage}
          className="font-nata-sans-bold dark:text-white mt-4 mb-1"
        >
          Hey Tech Trailblazer! 👋
        </Text>
        <View className="px-2">
          <Text
            style={shapes.introMessage}
            className="text-textLight dark:text-textDark font-medium mb-5"
          >
            Discover amazing projects tailored to your skills. Let&apos;s get to
            know you first!
          </Text>
        </View>
        <InfoCard
          icon={inputSkills.icon}
          title={inputSkills.title}
          description={inputSkills.description}
        />
        <InfoCard
          icon={aiAnalysis.icon}
          title={aiAnalysis.title}
          description={aiAnalysis.description}
        />
        <InfoCard
          icon={getProjects.icon}
          title={getProjects.title}
          description={getProjects.description}
        />
      </View>
      <ButtonGroup nextRoute="/(onboarding)/techstack" />
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
    flex: 1,
    height: vs(690),
    width: "100%",
    marginTop: vs(45),
    padding: ms(17),
    borderRadius: sc(17),
    borderWidth: sc(2),
  },
  welcomeMessage: {
    fontSize: ms(19),
  },
  subtitleMessage: {
    fontSize: ms(13),
  },
  introMessage: {
    fontSize: ms(13),
  },
});
