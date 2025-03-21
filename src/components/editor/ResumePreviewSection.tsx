import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import ResumePreview from "../reusables/ResumePreview";
import ColorPicker from "./ColorPicker";
import BorderStyleBtn from "./BorderStyleBtn";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps {
  resumeData: ResumeDataValidationSchema;
  setResumeData: (data: ResumeDataValidationSchema) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  return (
    <div
      className={cn("hidden w-full md:w-1/2 md:flex relative group", className)}
    >
      <div className="absolute left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3 opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) => {
            setResumeData({ ...resumeData, colorHex: color.hex });
          }}
        />
        <BorderStyleBtn
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) => {
            setResumeData({ ...resumeData, borderStyle: borderStyle });
          }}
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-sm"
        />
      </div>
    </div>
  );
}
