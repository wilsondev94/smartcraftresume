import { Prisma } from "@prisma/client";
import { ResumeDataValidationSchema } from "./validationSchema";

export interface EditorFormProps {
  resumeData: ResumeDataValidationSchema;
  setResumeData: (data: ResumeDataValidationSchema) => void;
}

export const resumeIncludedData = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeIncludedData;
}>;
