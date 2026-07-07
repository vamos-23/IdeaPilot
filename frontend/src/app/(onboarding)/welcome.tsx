import ButtonGroup from "@/src/components/ButtonGroup";
import IdeaPilotLogo from "@/src/components/IdeaPilotLogo";
import InfoCard from "@/src/components/InfoCard";
import UserIconLogo from "@/src/components/UserIconLogo";
import { Code, Sparkles, Target, User } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ms, sc, vs } from "../../constants/responsive";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { bottom } = useSafeAreaInsets();

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
    <View  className="bg-brandLight dark:bg-brandDark flex-1" style={{
      paddingBottom: bottom
    }}>
      <ScrollView
        contentContainerStyle={shapes.main}
        showsVerticalScrollIndicator={false}
       
      >
        <View
          style={shapes.welcomeContainer}
          className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none items-center w-full"
        >
          <UserIconLogo icon={<User size={sc(45)} stroke="dodgerblue" />} />

          <Text
            style={shapes.welcomeMessage}
            className="text-textLight dark:text-white font-nata-sans-bold mt-4"
          >
            Welcome to IdeaPilot!
          </Text>
          <Text
            style={shapes.subtitleMessage}
            className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-5 text-center px-2"
          >
            Let&apos;s personalize your experience!
          </Text>

          <IdeaPilotLogo />

          <Text
            style={shapes.welcomeMessage}
            className="text-textLight dark:text-white font-nata-sans-bold mt-4 mb-1"
          >
            Hey Tech Trailblazer! 👋
          </Text>
          <View className="px-2">
            <Text
              style={shapes.introMessage}
              className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-5 text-center"
            >
              Discover amazing projects tailored to your skills. Let&apos;s get
              to know you first!
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
    </View>
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
    height: vs(745),
    marginTop: vs(45),
    padding: ms(17),
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
