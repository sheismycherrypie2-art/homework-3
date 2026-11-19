const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (
    typeof data !== "object" ||
    data === null ||
    isArray(data)
  ) {
    return false;
  }

  if (
    typeof data.quizTitle !== "string" ||
    data.quizTitle.trim() === ""
  ) {
    return false;
  }

  if (
    !isArray(data.correctAnswers) ||
    data.correctAnswers.length === 0
  ) {
    return false;
  }

  if (
    !isArray(data.attempts) ||
    data.attempts.length === 0
  ) {
    return false;
  }

  for (const attempt of data.attempts) {
    if (
      typeof attempt !== "object" ||
      attempt === null ||
      isArray(attempt)
    ) {
      return false;
    }

    if (
      typeof attempt.name !== "string" ||
      attempt.name.trim() === ""
    ) {
      return false;
    }

    if (
      !isArray(attempt.answers) ||
      attempt.answers.length !== data.correctAnswers.length
    ) {
      return false;
    }
  }

  return true;
}

export function calculateAttempt(attempt, correctAnswers) {
  const name = attempt.name.trim();

  let score = 0;

  for (let i = 0; i < correctAnswers.length; i++) {
    if (attempt.answers[i] === correctAnswers[i]) {
      score++;
    }
  }

  const percentage = Math.round(
    (score / correctAnswers.length) * 100
  );

  const passed = percentage >= PASSING_PERCENTAGE;

  return {
    name,
    score,
    percentage,
    passed
  };
}

export function calculateReport(data) {
  const quizTitle = data.quizTitle.trim();
  const questionCount = data.correctAnswers.length;
  const participantCount = data.attempts.length;

  const attempts = data.attempts.map(attempt => {
    return calculateAttempt(attempt, data.correctAnswers);
  });

  let totalPercentage = 0;

  attempts.forEach(attempt => {
    totalPercentage += attempt.percentage;
  });

  const averagePercentage = Math.round(
    totalPercentage / participantCount
  );

  let passedCount = 0;

  attempts.forEach(attempt => {
    if (attempt.passed === true) {
      passedCount++;
    }
  });

  let best = attempts[0];

  attempts.forEach(attempt => {
    if (attempt.score > best.score) {
      best = attempt;
    }
  });

  return {
    quizTitle,
    questionCount,
    participantCount,
    averagePercentage,
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts
  };
}
