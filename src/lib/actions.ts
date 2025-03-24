"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import prisma from "./prisma";

import path from "path";
import {
  ResumeDataValidationSchema,
  resumeValidationSchema,
} from "./validationSchema";
import { revalidatePath } from "next/cache";
import stripe from "./stripe";
import { env } from "@/env";
import { getUserSubLevel } from "./subscription";
import { canCreateResume, canUseCutomizations } from "./permission";

export async function saveResume(values: ResumeDataValidationSchema) {
  const { id } = values;

  const { photo, workExperiences, educations, ...ResumeDataValidationSchema } =
    resumeValidationSchema.parse(values);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized user");
  }

  //   Check resume count for non-premium users
  const userSubLevel = await getUserSubLevel(userId);

  if (!id) {
    const resumeCount = await prisma.resume.count({ where: { userId } });

    if (!canCreateResume(userSubLevel, resumeCount))
      throw new Error(
        "Maximum resume count reached for this subscription level."
      );
  }

  const existingResume = id
    ? await prisma.resume.findUnique({
        where: { id, userId },
      })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  const hasCustomization =
    (ResumeDataValidationSchema.borderStyle &&
      ResumeDataValidationSchema.borderStyle !== existingResume?.borderStyle) ||
    (ResumeDataValidationSchema.colorHex &&
      ResumeDataValidationSchema.colorHex !== existingResume?.colorHex);

  if (hasCustomization && !canUseCutomizations(userSubLevel)) {
    throw new Error("Customization not allowed.");
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

export async function deleteResume(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized action!");

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) throw new Error("Resume not found");

  if (resume.photoUrl) {
    await del(resume.photoUrl);
  }

  await prisma.resume.delete({
    where: { id },
  });

  revalidatePath("/resumes");
}

export async function createCheckout(priceId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized user");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer_email: user.emailAddresses[0].emailAddress,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read Smartcraft Resume's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and I have agreed with them`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!session.url) throw new Error("Failed to create checkout.");

  return session.url;
}
