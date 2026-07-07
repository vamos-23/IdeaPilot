import React from "react";
import { Repository } from "@/src/constants/types";
import { View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { openLink } from "../../../../services/projectResources/deepLinking";
import Ionicons from "@expo/vector-icons/Ionicons";
import useThemeStore from "@/src/store/useThemeStore";

function GithubCard({ item }: { item: Repository }) {
  const isDark = useThemeStore((s) => s.theme === "dark");

  const handleGithubLinkOpen = () => {
    openLink(item.repoUrl, "github");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handleGithubLinkOpen}
      className="w-[300px] p-4 bg-cardLight dark:bg-cardDark rounded-[20px] border border-slate-200 dark:border-white/10"
    >
      <View className="flex-row gap-2 items-center mb-2">
        {item.avatarUrl ? (
          <Image
            source={item.avatarUrl}
            transition={200}
            contentFit="cover"
            style={{ width: 30, height: 30, borderRadius: 30 }}
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 items-center justify-center border border-slate-200 dark:border-white/10">
            <Ionicons name="book" size={16} color="#0ea5e9" />
          </View>
        )}
        <View className="flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 text-sm text-slate-900 dark:text-white font-nata-sans-bold"
          >
            {item.fullName.split("/")[0]}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1 text-sm text-slate-900 dark:text-white font-nata-sans-bold"
          >
            {item.name}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={7}
        className="flex-1 text-[12px] font-nata-sans-medium text-slate-600 dark:text-slate-300 leading-[18px]"
      >
        {item.description || "No description provided"}
      </Text>

      <View className="h-[1px] bg-slate-200 dark:bg-white/10 my-3" />

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="star"
            size={13}
            color={isDark ? "#fbbf24" : "#f59e0b"}
          />
          <Text className="text-[12px] font-nata-sans-medium text-slate-600 dark:text-slate-300">
            {item.stars}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="git-network-outline"
            size={13}
            color={isDark ? "#34d399" : "#10b981"}
          />
          <Text className="text-[12px] font-nata-sans-medium text-slate-600 dark:text-slate-300">
            {item.forks}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons
            name="eye-outline"
            size={13}
            color={isDark ? "#38bdf8" : "#0ea5e9"}
          />
          <Text className="text-[12px] font-nata-sans-medium text-slate-600 dark:text-slate-300">
            {item.watchers}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GithubCard);
