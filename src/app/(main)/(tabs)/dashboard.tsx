import { ProjectInfo } from "@/src/components/ProjectInfo";
import useAuthStore from "@/src/store/useAuthStore";
import useThemeStore from "@/src/store/useThemeStore";
import { FlashList } from "@shopify/flash-list";
import { Bookmark, CircleCheck, CirclePlay, Clock } from "lucide-react-native";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { sc, vs } from "../../../constants/responsive";

export default function Dashboard() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const userName = user?.userName;

  // Mock data for the list - replace with your actual data source
  const projectsData = Array.from({ length: 10}, (_, i) => ({
    id: i,
    name: `Project ${i + 1}`,
  }));

  const stats = [
    {
      title: "Total Projects",
      value: 1,
      textColor: theme === "light" ? "#6B7280" : "#9CA3AF",
      icon: (
        <Bookmark
          stroke={theme === "light" ? "#6B7280" : "#9CA3AF"}
          size={sc(25)}
          strokeWidth={sc(2)}
        />
      ),
    },
    {
      title: "In Progress",
      value: 1,
      textColor: "#3B82F6",
      icon: <CirclePlay stroke="#3B82F6" size={sc(25)} strokeWidth={sc(2)} />,
    },
    {
      title: "Completed",
      value: 1,
      textColor: theme === "light" ? "#06991a" : "#22C55E",
      icon: (
        <CircleCheck
          stroke={theme === "light" ? "#06991a" : "#22C55E"}
          size={sc(25)}
          strokeWidth={sc(2)}
        />
      ),
    },
    {
      title: "Planned",
      value: 1,
      textColor: theme === "light" ? "#ed8134" : "#EAB308",
      icon: (
        <Clock
          stroke={theme === "light" ? "#ed8134" : "#EAB308"}
          size={sc(25)}
          strokeWidth={sc(2)}
        />
      ),
    },
  ];

  // Everything that was in your ScrollView goes here
  const DashboardHeader = () => (
    <View className="pt-5">
      <View className="mb-2 gap-y-0.5">
        <Text
          className="text-black dark:text-white font-nata-sans-bold"
          style={styles.title}
        >
          Dashboard
        </Text>
        <Text
          className="text-textLight dark:text-textDark font-semibold"
          style={styles.subtitle}
        >
          Ready to work on your next project?{"\n"}Here&apos;s what&apos;
          happening.
        </Text>
      </View>
      <View className="mt-6 mb-7 gap-y-1">
        <Text
          className="text-black dark:text-white font-nata-sans-bold"
          style={styles.title}
        >
          Welcome Back, {userName} 👋
        </Text>
      </View>
      <View className="gap-y-5 mb-6">
        {stats.map((stat, index) => (
          <ProjectInfo key={index} {...stat} />
        ))}
      </View>

      {/* SEARCH BAR & SECTION TITLE */}
      <View className="mb-4">
        {/* <YourSearchBar /> */}
        <Text
          className="text-black dark:text-white font-nata-sans-bold mt-4"
          style={{ fontSize: sc(24) }}
        >
          Your Projects
        </Text>
      </View>
    </View>
  );

  const renderComponent = useCallback(({ item }: { item: any }) => {
    return (
      <View className="p-4 mb-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
        <Text className="text-black dark:text-white">{item.name}</Text>
      </View>
    );
  }, []);
  return (
    <View className="bg-brandLight dark:bg-[#011035] flex-1">
      <FlashList
        data={projectsData}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={DashboardHeader}
        renderItem={renderComponent}
        contentContainerStyle={{
          paddingHorizontal: sc(24),
          paddingBottom: vs(27),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: sc(25) },
  subtitle: { fontSize: sc(12) },
});
