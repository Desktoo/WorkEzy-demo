import { uploadFile } from "@/lib/supabase/upload";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import axios from "axios";

type CandidateApplicationPayload = Omit<
  CandidateApplyFormValues,
  "photo" | "dateOfBirth"
> & {
  photo: string | null;
  dateOfBirth: Date | null;
};

function normalizeCandidateDates(
  data: CandidateApplyFormValues
) {
  return {
    ...data,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
  };
}



/* ---------------- Submit Application ---------------- */

export async function submitCandidateApplication(
  data: CandidateApplyFormValues,
  jobId: string
): Promise<void> {
  try {
    /* ---------- 1️⃣ Normalize dates ---------- */
    const normalizedData = normalizeCandidateDates(data);

    /* ---------- 2️⃣ Upload photo (if any) ---------- */
    let photoUrl: string | null = null;

    if (normalizedData.photo instanceof File) {
      const uploaded = await uploadFile(normalizedData.photo, {
        bucket: "WorkEzy-Storage",
        folder: "candidate/photo",
        fileCategory: "image",
        maxSizeMB: 2,
      });

      photoUrl = uploaded?.url ?? null;
    }

    /* ---------- 3️⃣ Split payload correctly ---------- */
    const {
      filteringAnswers, // ❌ application-level
      photo,            // ❌ replaced with URL
      ...candidateOnlyData
    } = normalizedData;

    /* ---------- 4️⃣ Create Candidate ---------- */
    const candidateRes = await axios.post("/api/candidate", {
      ...candidateOnlyData,
      photo: photoUrl,
    });

    const candidateId: string = candidateRes.data?.candidate?.id;

    if (!candidateId) {
      throw new Error("Candidate creation failed");
    }

    /* ---------- 5️⃣ Create Application ---------- */
    await axios.post("/api/applications", {
      jobId,
      candidateId,
      filteringAnswers: filteringAnswers ?? [], // ✅ optional
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Candidate apply error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    }

    console.error("Unexpected apply error:", error);

    throw error instanceof Error
      ? error
      : new Error("Unknown application error");
  }
}


export async function updateCandidateApplication(
  candidateId: string,
  data: CandidateApplyFormValues
) {
  let photoUrl: string | null = null;

  if (data.photo instanceof File) {
    const uploaded = await uploadFile(data.photo, {
      bucket: "WorkEzy-Storage",
      folder: "candidate/photo",
      fileCategory: "image",
      maxSizeMB: 2,
    });

    photoUrl = uploaded?.url ?? null;
  }

  const {...rest } = data;

  const payload = {
    ...rest,
    photo: photoUrl,
  };

  await axios.patch(`/api/candidate/${candidateId}`, payload);
}

