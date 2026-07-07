import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api/apiClient";
import { VideoTutorial, Repository } from "../constants/types";
import { useMemo } from "react";

type UseProjectResourcesArgs = {
  resourceType: "youtube" | "github";
  techStack: string[];
  domain: string;
  category: string;
  isResourceTabOpen: boolean;
};

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const fetchResources = async (
  type: string,
  searchQuery: string,
): Promise<VideoTutorial[] | Repository[]> => {
  try {
    const urlComponent = `/resources/${type}?query=${encodeURIComponent(searchQuery)}`;
    const { data: projectResource } = await apiClient.get(`${urlComponent}`);
    return projectResource.data;
  } catch (error: any) {
    const customErrorMessage = error?.response?.data?.message;
    throw new Error(customErrorMessage || error?.message);
  }
};

export default function useProjectResources({
  resourceType,
  techStack,
  domain,
  category,
  isResourceTabOpen,
}: UseProjectResourcesArgs) {
  const effectiveTechnologies = useMemo(() => {
    if (!techStack || techStack.length === 0) return "";
    const shuffledTechStack = shuffleArray([...techStack]);

    return shuffledTechStack.slice(0, 2).join(" ");
  }, [techStack]);

  const cleanDomain = domain.split("&").pop()?.trim() || domain;
  const cleanCategory = category.split(" ")[0];

  const searchQuery = useMemo(() => {
    if (resourceType === "youtube") {
      return `${effectiveTechnologies} ${cleanDomain} ${cleanCategory} build or tutorials`;
    } else {
      return `${effectiveTechnologies} ${cleanCategory}`;
    }
  }, [resourceType, effectiveTechnologies, cleanDomain, cleanCategory]);

  return useQuery<VideoTutorial[] | Repository[]>({
    queryKey: ["resources", resourceType, searchQuery],
    queryFn: () => fetchResources(resourceType, searchQuery),
    retry: 1,
    enabled: isResourceTabOpen,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 45,
  });
}
