import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

////////////////////////////////////////////////////////

export const generalInfoValidationSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValidationSchemaValues = z.infer<
  typeof generalInfoValidationSchema
>;

////////////////////////////////////////////////////////

export const personalInfoValidationSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "File must be an image"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File size must be less than 4MB"
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  email: optionalString,
  phone: optionalString,
});

export type PersonalInfoValidationSchemaValues = z.infer<
  typeof personalInfoValidationSchema
>;

////////////////////////////////////////////////////////

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

// A type to access a work experience in the work experiences array
// export type WorkExperience = NonNullable<
//   z.infer<typeof workExperienceSchema>["workExperiences"]
// >[number];

////////////////////////////////////////////////////////

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      })
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

////////////////////////////////////////////////////////

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

////////////////////////////////////////////////////////

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

////////////////////////////////////////////////////////

export const resumeValidationSchema = z.object({
  ...generalInfoValidationSchema.shape,
  ...personalInfoValidationSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export type ResumeDataValidationSchema = Omit<
  z.infer<typeof resumeValidationSchema>,
  "photo"
> & { id?: string; photo?: File | string | null };
