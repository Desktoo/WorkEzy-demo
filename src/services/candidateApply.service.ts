import { uploadFile } from "@/lib/supabase/upload";
import { CandidateApplyFormValues } from "@/lib/validations/frontend/candidate.schema";
import axios from "axios";

/* --------------------------------
   Helpers
--------------------------------- */

function normalizeCandidateDates(
  data: CandidateApplyFormValues
) {
  return {
    ...data,
    dateOfBirth: data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : null,
  };
}

/* --------------------------------
   Submit Application (FINAL)
--------------------------------- */

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

    /* ---------- 3️⃣ Prepare payload ---------- */
    const {
      photo,             // ❌ File object
      filteringAnswers,  // ❌ handled by backend later
      ...candidateData
    } = normalizedData;

    /* ---------- 4️⃣ Single API call ---------- */
    await axios.post("/api/candidate", {
      ...candidateData,
      jobId,             // ✅ REQUIRED
      photo: photoUrl,
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

/* --------------------------------
   Update Candidate Profile
--------------------------------- */

export async function updateCandidateApplication(
  candidateId: string,
  data: CandidateApplyFormValues
): Promise<void> {
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

  const payload = {
    ...data,
    photo: photoUrl,
  };

  await axios.patch(`/api/candidate/${candidateId}`, payload);
}
