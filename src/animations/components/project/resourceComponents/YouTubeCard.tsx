import React from "react";
import { VideoTutorial } from "@/src/constants/types";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { DARK_BLURHASH, LIGHT_BLURHASH } from "../../../../constants/resources";
import useThemeStore from "@/src/store/useThemeStore";
import { openLink } from "../../../../services/projectResources/deepLinking";

function YouTubeCard({ item }: { item: VideoTutorial }) {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const activeBlurHash = isDark ? DARK_BLURHASH : LIGHT_BLURHASH;

  const handleYoutubeLinkOpen = () => {
    openLink(item.videoUrl, "youtube");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleYoutubeLinkOpen}
      className="w-[300px] h-[300px] bg-cardLight dark:bg-cardDark rounded-[15px] border border-slate-200 dark:border-white/10 overflow-hidden"
    >
      <View className="relative h-[200px] w-full">
        <Image
          source={item.thumbnailUrl}
          placeholder={activeBlurHash}
          contentFit="cover"
          transition={{
            duration: 200,
            timing: "ease-in",
            effect: "cross-dissolve",
          }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View className="p-4 gap-1.5">
        <Text
          numberOfLines={2}
          className="text-[14px] font-nata-sans-bold text-slate-900 dark:text-white leading-tight"
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          className="text-sm font-nata-sans-bold text-slate-600 dark:text-white"
        >
          {item.channelName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(YouTubeCard);
