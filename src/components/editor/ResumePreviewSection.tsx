import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import ResumePreview from "../reusables/ResumePreview";

interface ResumePreviewSectionProps {
  resumeData: ResumeDataValidationSchema;
  setResumeData: (data: ResumeDataValidationSchema) => void;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
}: ResumePreviewSectionProps) {
  return (
    <div className="hidden w-1/2 md:flex ">
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-sm"
        />
      </div>
    </div>
  );
}
