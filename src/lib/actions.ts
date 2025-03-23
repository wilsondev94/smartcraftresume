"use server";

import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import prisma from "./prisma";

import path from "path";
import {
  ResumeDataValidationSchema,
  resumeValidationSchema,
} from "./validationSchema";

export async function saveResume(values: ResumeDataValidationSchema) {
  const { id } = values;

  const { photo, workExperiences, educations, ...ResumeDataValidationSchema } =
    resumeValidationSchema.parse(values);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized user");
  }

  //   Check resume count for non-premium users

  const existingResume = id
    ? await prisma.resume.findUnique({
        where: { id, userId },
      })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    //   To first delete the old photo in the database before uploading a new one
    if (existingResume?.photoUrl) await del(existingResume.photoUrl);

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  // Use newPhotoUrl to update the resume in the database
  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...ResumeDataValidationSchema,
        photoUrl: newPhotoUrl,

        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },

        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...ResumeDataValidationSchema,
        userId,
        photoUrl: newPhotoUrl,

        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },

        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
