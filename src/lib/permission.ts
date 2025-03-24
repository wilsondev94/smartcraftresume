import { SubOptions } from "./subscription";

export function canCreateResume(
  SubLevel: SubOptions,
  currentResumeCount: number
) {
  const maxResumeMap: Record<SubOptions, number> = {
    free: 2,
    premium: 4,
    premium_plus: Infinity,
  };

  // if (SubLevel === "free") {
  //   return currentResumeCount < maxResumeMap.free;
  // } else if (SubLevel === "premium") {
  //   return currentResumeCount < maxResumeMap.premium;
  // } else {
  //   return currentResumeCount < maxResumeMap.premium_plus;
  // }

  const maxResumes = maxResumeMap[SubLevel];

  return currentResumeCount < maxResumes;
}

export function canUseAiTool(SubLevel: SubOptions) {
  return SubLevel !== "free";
}

export function canUseCutomizations(SubLevel: SubOptions) {
  return SubLevel === "premium_plus";
}
