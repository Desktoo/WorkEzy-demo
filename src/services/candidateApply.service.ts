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
    let photoUrl : string | null = null;

    if(typeof data.photo === "string"){
      photoUrl = data.photo;
    }

    /* ---------- 2️⃣ Upload photo (if any) ---------- */

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

    console.log("this is the data before going to the API: ", normalizedData)

    /* ---------- 4️⃣ Single API call ---------- */
    await axios.post("/api/candidate", {
      ...candidateData,
      jobId,             // ✅ REQUIRED
      photo: photoUrl,
      filteringAnswers
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
