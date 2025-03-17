import { EditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./GeneralInfoForm";
import PersonalInfoForm from "./PersonalInfoForm";
import WorkExperienceForm from "./WorkExperienceForm";
import EducationForm from "./EducationForm";
import SkillsForm from "./SkillsForm";
import SummaryForm from "./SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<EditorFormProps>;
  key: string;
}[] = [
  {
    title: "General information",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal information",
    component: PersonalInfoForm,
    key: "personal-info",
  },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skills",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
];
