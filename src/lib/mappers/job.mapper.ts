import { PostJobFormValues } from "@/lib/validations/frontend/jobPost.schema";

/* --------------------------------
   General structural types
--------------------------------- */

type YesNo = "yes" | "no";

type FilteringQuestion = {
  question: string;
  expectedAnswer: string;
};

type JobWithFilteringQuestions = {
  jobTitle: string;
  city: string;
  state: string;
  minExperience: string;
  minEducation: string;
  jobType: string;
  locationType: string;
  minSalary: string;
  maxSalary: string;

  startTime: Date | null;
  endTime: Date | null;

  daysPerWeek: string;
  benefits: string[] | null;
  jobDescription: string;

  filteringQuestions: FilteringQuestion[];
};

/* --------------------------------
   Helpers
--------------------------------- */

function normalizeExpectedAnswer(value: string): YesNo {
  return value === "no" ? "no" : "yes";
}

/* --------------------------------
   Mapper
--------------------------------- */

/**
 * Converts Job object → RHF Form Values
 */
export function mapJobToPostJobForm(
  job: JobWithFilteringQuestions
): PostJobFormValues {
  return {
    jobTitle: job.jobTitle,
    city: job.city,
    state: job.state,
    minExperience: job.minExperience,
    minEducation: job.minEducation,
    jobType: job.jobType,
    locationType: job.locationType,
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,

    // ✅ Date → string
    startTime: job.startTime
      ? job.startTime.toISOString().slice(11, 16)
      : "",
    endTime: job.endTime
      ? job.endTime.toISOString().slice(11, 16)
      : "",

    daysPerWeek: job.daysPerWeek,
    benefits: job.benefits ?? [],
    jobDescription: job.jobDescription,

    filteringQuestions:
      job.filteringQuestions.length > 0
        ? job.filteringQuestions.map((q) => ({
            question: q.question,
            expectedAnswer: normalizeExpectedAnswer(q.expectedAnswer),
          }))
        : [{ question: "", expectedAnswer: "yes" }],
  };
}
