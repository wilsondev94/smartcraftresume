import { useSearchParams } from "next/navigation";
import useDebounce from "./useDebounce";

import { saveResume } from "@/lib/actions";
import { ResumeDataValidationSchema } from "@/lib/validationSchema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSave(resumeData: ResumeDataValidationSchema) {
  const searchParams = useSearchParams();

  const debounceResumeData = useDebounce(resumeData, 1500);

  const [resumeId, setResumeId] = useState(resumeData.id);

  const [lastSavedData, setLastSavedData] = useState(
    //To ensure the last saved data isn't changed with new changes in the resumeData
    structuredClone(resumeData)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debounceResumeData]);

  useEffect(() => {
    async function saveChanges() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debounceResumeData);

        const updatedResume = await saveResume({
          // To ensure the same photo is not sent to the db multiple times while updating the resume in the db
          ...newData,
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        // To also update the url while sending the updated resumeData to the db
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);

          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        toast.error(
          <div className="space-y-3">
            <p>Changes could not be saved</p>
          </div>
        );
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnSavedChanges =
      JSON.stringify(debounceResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnSavedChanges && debounceResumeData && !isSaving && !isError)
      saveChanges();
  }, [
    debounceResumeData,
    lastSavedData,
    isSaving,
    resumeId,
    searchParams,
    isError,
  ]);

  return {
    isSaving,
    hasUnSavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
}
