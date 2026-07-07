import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CodeHighlighter from "react-native-code-highlighter";
import {
  a11yDark,
  dracula,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";

import useThemeStore from "@/src/store/useThemeStore";

type CustomCodeBlockProps = {
  content: string;
  language?: string;
};

const CustomCodeBlock = ({
  content,
  language = "text",
}: CustomCodeBlockProps) => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  const [isCopied, setIsCopied] = useState(false);

  const syntaxTheme = isDark ? dracula : a11yDark;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <View
      className="w-full my-3 overflow-hidden rounded-2xl border bg-slate-50 border-slate-300 dark:bg-slate-800 dark:border-slate-700"
      style={{
        shadowColor: "#000",
        shadowOpacity: isDark ? 0 : 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: isDark ? 0 : 2,
      }}
    >

      <View className="flex-row items-center justify-between border-b border-slate-300 bg-sky-200/20 px-4 py-3 dark:border-slate-600 dark:bg-slate-900">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="code-braces"
            size={18}
            color={isDark ? "#22D3EE" : "#0891B2"}
          />

          <Text className="ml-2 font-nata-sans-bold text-[13px] capitalize tracking-wide text-slate-700 dark:text-slate-50">
            {language}
          </Text>
        </View>

        <Pressable
          onPress={handleCopy}
          hitSlop={12}
          className="rounded-xl bg-slate-300 px-2.5 py-2 active:opacity-70 dark:bg-white/10"
        >
          <MaterialCommunityIcons
            name={isCopied ? "check-circle-outline" : "content-copy"}
            size={16}
            color={isCopied ? "#34D399" : isDark ? "#CBD5E1" : "#475569"}
          />
        </Pressable>
      </View>

      <CodeHighlighter
        hljsStyle={syntaxTheme}
        language={language.toLowerCase()}
        textStyle={{
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 20,
        }}
        scrollViewProps={{
          horizontal: true,
          showsHorizontalScrollIndicator: true,
          contentContainerStyle: {
            padding: 16,
            minWidth: "100%",
          },
        }}
      >
        {content}
      </CodeHighlighter>
    </View>
  );
};

export default CustomCodeBlock;
