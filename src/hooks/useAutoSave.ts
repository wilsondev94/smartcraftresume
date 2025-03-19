import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

export default function useAutoSave(resumeData: ResumeDataValidationSchema) {
  const debounceResumeData = useDebounce(resumeData, 1500);

  const [lastSavedData, setLastSavedData] = useState(
    //    To ensure the last saved data isn't changed with new changes in the resumeData
    structuredClone(resumeData)
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function saveChanges() {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLastSavedData(structuredClone(debounceResumeData));

      setIsSaving(false);
    }

    const hasUnSavedChanges =
      JSON.stringify(debounceResumeData) !== JSON.stringify(lastSavedData);

    if (hasUnSavedChanges && debounceResumeData && !isSaving) saveChanges();
  }, [debounceResumeData, lastSavedData, isSaving]);

  return {
    isSaving,
    hasUnSavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
