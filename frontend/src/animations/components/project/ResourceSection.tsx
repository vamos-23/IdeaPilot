import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChevronRight } from "lucide-react-native";
import useProjectResources from "../../../store/useResourceQueries";
import YouTubeCard from "./resourceComponents/YouTubeCard";
import GithubCard from "./resourceComponents/GithubCard";
import useThemeStore from "@/src/store/useThemeStore";

type ResourceSectionProps = {
  title: string;
  type: "youtube" | "github";
  techStack: string[];
  domain: string;
  category: string;
};

function ResourceSection({
  title,
  type,
  techStack,
  domain,
  category,
}: ResourceSectionProps) {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data, isPending, isError, error, isSuccess } = useProjectResources({
    resourceType: type,
    techStack: techStack,
    domain: domain,
    category: category,
    isResourceTabOpen: isOpen,
  });

  const config = {
    youtube: {
      Icon: (props: any) => <Entypo name="youtube" {...props} />,
      color: "#ea580c",
      bgClass: "bg-red-100/50 dark:bg-orange-500/10",
      borderClass: "border-red-300 dark:border-orange-500/20",
      textClass: "text-red-500 dark: text-orange-600",
      disclaimer: "Tap to load curated videos",
      loadingText: "Loading related videos...",
      CardComponent: YouTubeCard,
    },
    github: {
      Icon: (props: any) => <AntDesign name="github" {...props} />,
      color: "#0ea5e9",
      bgClass: "bg-sky-50 dark:bg-sky-500/10",
      borderClass: "border-sky-300 dark:border-sky-500/20",
      textClass: "text-sky-500 dark: text-blue-500",
      disclaimer: "Tap to load curated repos",
      loadingText: "Loading relevant repositories...",
      CardComponent: GithubCard,
    },
  }[type];

  const Icon = config.Icon;
  const CardComponent = config.CardComponent;
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Animated.View
      layout={LinearTransition.duration(700).damping(25).stiffness(200)}
      className="overflow-hidden"
    >
      {!isOpen && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggle}
            className={`flex-row items-center justify-between py-3 px-3 rounded-2xl border ${config.bgClass} ${config.borderClass}`}
          >
            <View className="flex-row gap-3">
              <View className="p-3.5 justify-center bg-white dark:bg-white/5 rounded-2xl shadow-sm dark:shadow-none">
                <Icon size={24} color={config.color} />
              </View>
              <View className="gap-1">
                <Text
                  className={`${
                    config.textClass
                  } font-nata-sans-bold text-[16px] mb-0.5`}
                >
                  {title}
                </Text>
                <Text className=" text-slate-600 dark:text-slate-400 font-nata-sans-medium text-[13px]">
                  {config.disclaimer}
                </Text>
              </View>
            </View>
            <View className="bg-white/60 dark:bg-white/10 p-2.5 rounded-full border border-slate-300/50 dark:border-slate-700/30">
              <ChevronRight size={20} color={config.color} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {isOpen && isPending && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(250)}
          className="h-[200px] bg-slate-100 dark:bg-cardDark rounded-[28px] border border-slate-200 dark:border-white/5 items-center justify-center"
        >
          <ActivityIndicator size="large" color={config.color} />
          <Text className="mt-4 font-nata-sans-medium text-slate-500 dark:text-slate-400 text-sm">
            {config.loadingText}
          </Text>
        </Animated.View>
      )}

      {isOpen && isError && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(250)}
          className="h-[200px] bg-cardLight dark:bg-cardDark rounded-[28px] border border-slate-200 dark:border-white/5 items-center justify-center gap-4 p-6"
        >
          <View className="flex-row gap-2 item-center justify-center px-6">
            <Ionicons
              name="alert-circle-sharp"
              size={16}
              color={config.color}
              className="mt-1"
            />
            <Text className="font-nata-sans-medium text-slate-500 dark:text-slate-400 text-sm flex-wrap">
              {error?.message || "Please try again later."}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggle}
            className={`items-center justify-center px-3 py-2 ${config.borderClass} rounded-xl`}
            style={{ backgroundColor: config.color }}
          >
            <Text className="text-base font-nata-sans-bold text-white">
              Close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {isOpen && isSuccess && (
        <Animated.View
          entering={FadeInDown.duration(600).damping(40)}
          exiting={FadeOutUp.duration(250)}
          className="min-h-[250px] pt-4"
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggle}
            className="flex-row items-center justify-between mb-4 pl-1"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon size={20} color={config.color} />
              <Text
                className={`text-lg font-nata-sans-bold ${config.textClass}`}
              >
                {title}
              </Text>
              <Ionicons
                name="chevron-up"
                size={20}
                color={isDark ? "#8c8b88" : "#3d3d3c"}
              />
            </View>
          </TouchableOpacity>
          {data.length === 0 ? (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(250)}
              className="h-[200px] bg-cardLight dark:bg-cardDark rounded-[28px] border border-slate-200 dark:border-white/5 items-center justify-center gap-2 flex-1"
            >
              <View className="flex-1 items-center justify-center px-3 m-5">
                <View className="flex-row gap-2 items-center p-2">
                  <Ionicons
                    name="alert-circle-sharp"
                    size={16}
                    color={config.color}
                  />
                  <Text className="font-nata-sans-medium text-slate-500 dark:text-slate-400 text-sm">
                    No {type === "youtube" ? "Videos" : "Repositories"} Found
                  </Text>
                </View>
                <Text
                  numberOfLines={2}
                  className="font-nata-sans-medium text-slate-500 dark:text-slate-400 text-sm leading-snug"
                >
                  We couldn&apos;t find any similar resources.{"\n"} Try
                  tweaking your tech stack.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleToggle}
                  className={`items-center justify-center px-3 py-2 mt-5 ${config.borderClass} rounded-xl`}
                  style={{ backgroundColor: config.color }}
                >
                  <Text className="text-base font-nata-sans-bold text-white">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : (
            <FlashList<any>
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              //@ts-ignore
              estimatedItemSize={280}
              ItemSeparatorComponent={() => <View className="w-4" />}
              renderItem={({ item }) => {
                const DynamicComponent = CardComponent as any;
                return <DynamicComponent item={item} />;
              }}
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default React.memo(ResourceSection)
