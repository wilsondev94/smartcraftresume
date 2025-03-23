"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { cn, mapToResumeValues } from "@/lib/utils";
import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import ResumePreviewSection from "./ResumePreviewSection";
import { steps } from "./steps";
import useAutoSave from "@/hooks/useAutoSave";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null;
}

export default function ResumeEditor({ resumeToEdit }: ResumeEditorProps) {
  const searchPrarams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeDataValidationSchema>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {}
  );

  const [showResumePreview, setShowResumePreview] = useState(false);

  const { isSaving, hasUnSavedChanges } = useAutoSave(resumeData);
  useUnloadWarning(hasUnSavedChanges);

  function setCurrentStep(key: string) {
    const newSearchParams = new URLSearchParams(searchPrarams);
    newSearchParams.set("step", key);

    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const currentStep = searchPrarams.get("step") || steps[0].key;

  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex flex-col grow">
      <header className="space-y-1.5 border-b px-3 text-center">
        <h1 className="text-2xl font-bold">Create your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full md:w-1/2 md:block p-3 overflow-y-auto space-y-6",
              showResumePreview && "hidden"
            )}
          >
            <Breadcrumbs
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>

          <div className="grow md:border-r" />

          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        showResumePreview={showResumePreview}
        setShowResumePreview={setShowResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
}
