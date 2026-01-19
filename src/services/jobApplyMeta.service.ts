import axios from "axios";

export type FilteringQuestion = {
  id: string;
  question: string;
};

export type JobApplyMetaResponse = {
  companyLogo: string | null;
  filteringQuestions: FilteringQuestion[];
};

export async function fetchJobApplyMeta(
  jobId: string
): Promise<JobApplyMetaResponse> {
  const res = await axios.get(`/api/job/${jobId}/apply-meta`);
  return res.data;
}
