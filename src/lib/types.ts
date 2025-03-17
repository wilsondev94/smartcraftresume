import { ResumeDataValidationSchema } from "./validationSchema";

export interface EditorFormProps {
  resumeData: ResumeDataValidationSchema;
  setResumeData: (data: ResumeDataValidationSchema) => void;
}
