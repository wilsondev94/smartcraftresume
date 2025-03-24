import { SubOptions } from "./subscription";

export function canCreateResume(
  userSubLevel: SubOptions,
  currentResumeCount: number
) {
  const maxResumeMap: Record<SubOptions, number> = {
    free: 2,
    premium: 4,
    premium_plus: Infinity,
  };

  // if (userSubLevel === "free") {
  //   return currentResumeCount < maxResumeMap.free;
  // } else if (userSubLevel === "premium") {
  //   return currentResumeCount < maxResumeMap.premium;
  // } else {
  //   return currentResumeCount < maxResumeMap.premium_plus;
  // }

  const maxResumes = maxResumeMap[userSubLevel];

  return currentResumeCount < maxResumes;
}

export function canUseCutomizations(userSubLevel: SubOptions) {
  return userSubLevel === "premium_plus";
}

export function canUseAiTool(userSubLevel: SubOptions) {
  return userSubLevel !== "free";
}
