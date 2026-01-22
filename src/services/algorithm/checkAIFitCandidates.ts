type AiAnswer = {
  isFit: boolean;
};

/**
 * Final AI decision
 * Rule: fit >= notFit → FIT
 */
export function evaluateAiScreening(
  answers: AiAnswer[]
) {
  if (answers.length === 0) {
    return {
      fit: 0,
      notFit: 0,
      isFinal: false,
      isFit: false,
    };
  }

  let fit = 0;
  let notFit = 0;

  for (const ans of answers) {
    ans.isFit ? fit++ : notFit++;
  }

  return {
    fit,
    notFit,
    isFinal: true,
    isFit: fit >= notFit,
  };
}
