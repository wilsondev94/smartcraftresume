"use client";

import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { steps } from "./steps";
import ResumePreviewSection from "./ResumePreviewSection";

export default function ResumeEditor() {
  const searchPrarams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeDataValidationSchema>({});

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
          <div className="w-full md:w-1/2 p-3 overflow-y-auto space-y-6">
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
          />
        </div>
      </main>
      <Footer currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  );
}
