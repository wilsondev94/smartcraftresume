import Link from "next/link";
import { Button } from "../ui/button";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showResumePreview: boolean;
  setShowResumePreview: (show: boolean) => void;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  showResumePreview,
  setShowResumePreview,
}: FooterProps) {
  const prevStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            disabled={!prevStep}
            onClick={prevStep ? () => setCurrentStep(prevStep) : undefined}
          >
            Previous step
          </Button>
          <Button
            disabled={!nextStep}
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          >
            Next step
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          title={showResumePreview ? "Show input form" : "Show resume preview"}
          onClick={() => setShowResumePreview(!showResumePreview)}
          className="md:hidden"
        >
          {showResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-start gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">Close</Link>
          </Button>
          <p className="text-muted-foreground opacity-0">Saving...</p>
        </div>
      </div>
    </footer>
  );
}
