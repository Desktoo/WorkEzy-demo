import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";
import axios from "axios";

type JobPostPayload = Omit<PostJobFormValues, "startTime" | "endTime"> & {
  startTime: Date | null;
  endTime: Date | null;
};

function normalizeJobDates(data: PostJobFormValues) {
  return {
    ...data,
    startTime: data.startTime ? new Date(data.startTime) : null,
    endTime: data.endTime ? new Date(data.endTime) : null,
  };
}

export async function submitPostJob(data: PostJobFormValues): Promise<void> {
  try {
    const normalisedData = normalizeJobDates(data);

    const payload: JobPostPayload = normalisedData;

    await axios.post("/api/job", payload)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Candidate application API error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          "Failed to submit candidate application"
      );
    }

    console.error("Candidate application error:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown candidate application error");
  }
}


export async function getEmployerJobs() {
  const { data } = await axios.get("/api/job");
  return data.jobs as {
    id: string;
    jobTitle: string;
    city: string;
    state: string;
    locationType: string;
    minExperience: string;
    minEducation: string;
    jobType: string;
    minSalary: string;
    maxSalary: string;
    status: "ACTIVE" | "PENDING" | "EXPIRED";
    applicationsCount: number;
  }[];
}

export async function updateJob(
  jobId: string,
  data: PostJobFormValues
): Promise<void> {
  try {
    const normalisedData = normalizeJobDates(data);

    console.log("this is the normalised Data", normalisedData)
    console.log("this is the raw Data", data)

    const payload = {
      ...data,
      startTime: timeStringToDate(data.startTime),
      endTime: timeStringToDate(data.endTime)
    }

    console.log("this the payload after string to date", payload)

    await axios.patch(`/api/job/${jobId}`, payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("PATCH JOB API ERROR >>>", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to update job"
      );
    }
    throw error;
  }
}


/**
 * Converts "7:00 AM" | "12:30 PM" → Date (Prisma-compatible)
 * Base date is fixed to avoid timezone surprises.
 */
function timeStringToDate(time: string): Date {
  if (typeof time !== "string" || !time.trim()) {
    throw new Error("Invalid time string");
  }

  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const [hours, minutes, period] = match;

  let h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  if (period.toUpperCase() === "PM" && h !== 12) h += 12;
  if (period.toUpperCase() === "AM" && h === 12) h = 0;

  // Fixed base date (important for consistency)
  const date = new Date(Date.UTC(1970, 0, 1, h, m, 0));

  if (isNaN(date.getTime())) {
    throw new Error("Failed to parse time");
  }

  return date;
}
