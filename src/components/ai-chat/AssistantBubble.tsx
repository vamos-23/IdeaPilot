import React, { useMemo, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import Markdown, { ASTNode } from "react-native-markdown-display";
import ProjectBluePrint from "./ProjectBluePrint";
import useAuthStore from "@/src/store/useAuthStore";
import { useIdeas } from "@/src/store/useIdeas";
import Toast from "react-native-toast-message";
import {
  parseAIResponse,
  saveAIIdeasToVault,
} from "@/src/services/ideas/ideas.service";
import { vs } from "react-native-size-matters";
import useThemeStore from "@/src/store/useThemeStore";
import CustomCodeBlock from "./CustomCodeBlock";
import { SaveStatus } from "@/src/constants/types";

type AssistantResponse = {
  messageId: string;
  content: string;
  isLatestPreview: boolean;
  isStreaming: boolean;
};

function AssistantBubble({
  messageId,
  content,
  isLatestPreview,
  isStreaming,
}: AssistantResponse) {
  const userId = useAuthStore((s) => s.user?.userId);
  const saveLocalAIIdea = useIdeas((s) => s.saveLocalAIIdea);
  const aiIdeas = useIdeas((s) => s.aiIdeas);
  const appTheme = useThemeStore((s) => s.theme);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const { cleanText, projectData } = useMemo(
    () => parseAIResponse(content),
    [content],
  );

  const vaultIdea = useMemo(() => {
    if (!projectData?.id) return null;
    return aiIdeas.find((projectIdea) => projectIdea.id === projectData.id);
  }, [aiIdeas, projectData?.id]);

  const isAlreadySaved = !!vaultIdea;

  const isUptoDate = useMemo(() => {
    if (!vaultIdea) return false;
    return vaultIdea.projectPreviewId === messageId;
  }, [messageId, vaultIdea]);

  const handleSaveToAIVault = async () => {
    if (!userId || !projectData) return;
    setSaveStatus("saving");
    try {
      const payload = {
        ...projectData,
        projectPreviewId: messageId
      }
      const savedIdea = await saveAIIdeasToVault(userId, payload);
      saveLocalAIIdea(savedIdea);
      const newStatus = isAlreadySaved ? "updated" : "saved";
      setSaveStatus(newStatus);
      Toast.show({
        type: "success",
        text1: isAlreadySaved
          ? "Updated AI Vault! 🎉"
          : "Added to AI Vault! 🎉",
        text2: isAlreadySaved
          ? "Project updated in AI Vault!"
          : "Project successfully added under AI Vault!",
        topOffset: vs(35),
      });
    } catch (error) {
      setSaveStatus("idle");
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      Toast.show({
        type: "error",
        text1: "Uggh! 😖",
        text2: errorMessage,
        topOffset: vs(35),
      });
    }
  };

  const isDark = appTheme === "dark";
  const textColor = isDark ? "#E2E8F0" : "#334155";
  const headingColor = isDark ? "#F8FAFC" : "#0F172A";

  if (projectData && !isStreaming) {
    return (
      <View>
        <ProjectBluePrint
          data={projectData}
          onSave={handleSaveToAIVault}
          saveStatus={saveStatus}
          isLatest={isLatestPreview}
          isProjectInVault={isAlreadySaved}
          isUptoDate={isUptoDate}
          theme={appTheme}
        />
      </View>
    );
  }

  return (
    <View
      className={`px-5 py-3 bg-white dark:bg-[#1E293B] border border-black/5 dark:border-white/10 
    ${isStreaming ? "" : "w-full"} rounded-[20px] rounded-tl-sm`}
    >
      {isStreaming ? (
        <View className="h-6 justify-center items-start">
          <ActivityIndicator color="#818CF8" size="small" />
        </View>
      ) : (
        <Markdown
          rules={{
            fence: (node: ASTNode) => {
              const language = (node as ASTNode & { sourceInfo?: string })
                .sourceInfo;
              return (
                <CustomCodeBlock
                  key={node.key}
                  content={node.content}
                  language={language}
                />
              );
            },
          }}
          style={{
            body: {
              color: textColor,
              fontSize: 16,
              lineHeight: 24,
              fontFamily: "nata-sans-regular",
            },
            heading1: {
              fontSize: 22,
              lineHeight: 30,
              marginTop: 2,
              marginBottom: 8,
              color: headingColor,
              fontFamily: "nata-sans-bold",
            },
            heading2: {
              fontSize: 19,
              lineHeight: 26,
              marginTop: 14,
              marginBottom: 6,
              color: headingColor,
              fontFamily: "nata-sans-bold",
            },
            heading3: {
              fontSize: 17,
              lineHeight: 24,
              marginTop: 12,
              marginBottom: 6,
              color: headingColor,
              fontFamily: "nata-sans-bold",
            },
            paragraph: {
              marginTop: 0,
              marginBottom: 12,
            },
            list_item: {
              flexDirection: "row",
              marginBottom: 6,
            },
            bullet_list: {
              marginBottom: 12,
            },
            ordered_list: {
              marginBottom: 12,
            },
            strong: {
              fontFamily: "nata-sans-bold",
              color: headingColor,
            },
            blockquote: {
              borderLeftWidth: 4,
              borderLeftColor: "#818CF8",
              backgroundColor: isDark
                ? "rgba(129, 140, 248, 0.1)"
                : "rgba(129, 140, 248, 0.05)",
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginVertical: 12,
              borderRadius: 6,
            },
            link: {
              color: "#818CF8",
              textDecorationLine: "underline",
            },
            code_inline: {
              color: isDark ? "#F472B6" : "#E11D48",
              fontFamily: "monospace",
              backgroundColor: isDark
                ? "rgba(244, 114, 182, 0.15)"
                : "rgba(225, 29, 72, 0.08)",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 6,
              overflow: "hidden",
            },
            hr: {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              height: 1,
              marginVertical: 16,
            },
          }}
        >
          {cleanText.trim()}
        </Markdown>
      )}
    </View>
  );
}

export default React.memo(AssistantBubble, (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.isStreaming === nextProps.isStreaming &&
    prevProps.isLatestPreview === nextProps.isLatestPreview
  );
});
