import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";

import { cn } from "@/lib/utils";
import { useDimensions } from "@/hooks/useDimensions";
import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import { Badge } from "../ui/badge";
import { borderStyles } from "../editor/BorderStyleBtn";

interface ResumepreviewProps {
  resumeData: ResumeDataValidationSchema;
  className?: string;
  contentRef?: React.Ref<HTMLDivElement>;
}

export default function ResumePreview({
  resumeData,
  className,
  contentRef,
}: ResumepreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(containerRef);

  return (
    <div
      ref={containerRef}
      // 210mm/297mm = A4 paper
      className={cn(
        "bg-white h-fit w-full text-black aspect-[210/297] ",
        className
      )}
    >
      <div
        ref={contentRef}
        id="resumePreviewContent"
        style={{
          //  794px = 210mm (A4 paper width)
          zoom: (1 / 794) * width,
        }}
        className={cn("space-y-6 p-6", !width && "invisible")}
      >
        <PersonalInfoItems resumeData={resumeData} />
        <SummaryItem resumeData={resumeData} />
        <WorkExperienceItem resumeData={resumeData} />
        <EducationItems resumeData={resumeData} />
        <SkillsItem resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumepreviewItemsProps {
  resumeData: ResumeDataValidationSchema;
}

export function PersonalInfoItems({ resumeData }: ResumepreviewItemsProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === borderStyles.SQUARE
                ? "0px"
                : borderStyle === borderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}

      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p>{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

export function SummaryItem({ resumeData }: ResumepreviewItemsProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3 break-inside-avoid">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          Summary
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

export function WorkExperienceItem({ resumeData }: ResumepreviewItemsProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExpNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!workExpNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold break-inside-avoid"
          style={{
            color: colorHex,
          }}
        >
          Work Expperience
        </p>
        {workExpNotEmpty.map((exp, index) => (
          <div key={index} className="space-y-1 break-inside-avoid">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/dd/yyyy")} -{" "}
                  {exp.endDate
                    ? formatDate(exp.endDate, "MM/dd/yyyy")
                    : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function EducationItems({ resumeData }: ResumepreviewItemsProps) {
  const { educations, colorHex } = resumeData;

  const educationNotEmpty = educations?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  );

  if (!educationNotEmpty?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold break-inside-avoid"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
        {educationNotEmpty.map((edu, index) => (
          <div key={index} className="space-y-1 break-inside-avoid">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function SkillsItem({ resumeData }: ResumepreviewItemsProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3 break-inside-avoid">
        <p
          className="text-lg font-semibold "
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div className="flex flex-wrap gap-1 whitespace-pre-line text-sm">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-gray-200 text-black hover:bg-gray-200-200 rounded-full"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
