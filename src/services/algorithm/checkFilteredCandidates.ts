type FilteringQuestion = {
  id: string;
  expectedAnswer: string;
};

type FilteringAnswer = {
  questionId: string;
  candidateAnswer: string;
};

/**
 * Returns true if candidate passes filtering
 * Rule: right >= wrong (majority or tie)
 */
export function checkFilteredCandidates(
  filteringQuestions: FilteringQuestion[],
  filteringAnswers: FilteringAnswer[]
): {
  right: number;
  wrong: number;
  isFiltered: boolean;
} {
  let right = 0;
  let wrong = 0;

  const questionMap = new Map(
    filteringQuestions.map((q) => [q.id, q.expectedAnswer])
  );

  for (const answer of filteringAnswers) {
    const expected = questionMap.get(answer.questionId);
    if (!expected) continue;

    if (
      expected.trim().toLowerCase() ===
      answer.candidateAnswer.trim().toLowerCase()
    ) {
      right++;
    } else {
      wrong++;
    }
  }

  return {
    right,
    wrong,
    isFiltered: right >= wrong,
  };
}
