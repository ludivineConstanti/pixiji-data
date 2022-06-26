const dataScores = [];

const utilsGetUserScore = (email) =>
  dataScores.filter((e) => e.email === email)[0];
const utilsGetScores = (input) => {
  const { email } = input;

  const userScore = utilsGetUserScore(email);
  if (!userScore) {
    return [];
  }

  return userScore.kanjis;
};

const actionsScores = {
  setScore: ({ input }) => {
    const { email, kanjiId, isCorrect } = input;
    const date = new Date();

    const user = utilsGetUserScore(email);
    const kanjiScore = {
      answer: kanjiId,
      infosAnswer: {
        answeredRight: isCorrect ? [date] : [],
        answeredWrong: isCorrect ? [] : [date],
      },
    };
    if (!user) {
      dataScores.push({
        email,
        kanjis: [kanjiScore],
      });
      return {
        success: true,
        message:
          "This is the first answer that was registered on your account, congratulation!",
      };
    }
    const currentKanjiScore = user.kanjis.filter(
      (e) => e.answer.id === +kanjiId
    )[0];
    if (!currentKanjiScore) {
      user.kanjis.push(kanjiScore);
      return {
        success: true,
        message: "This is the first answer that was registered For this Kanji",
      };
    }
    if (isCorrect) {
      currentKanjiScore.infosAnswer.answeredRight.push(date);
      return {
        success: true,
        message: "Great, your score augmented by 1 point",
      };
    }
    if (!isCorrect) {
      currentKanjiScore.infosAnswer.answeredWrong.push(date);
      return { success: true, message: "Your score decreased by 1 point" };
    }
    return {
      success: false,
      message: "None of the given options were triggered",
    };
  },
  getScore: ({ input }) => {
    const results = utilsGetScores(input);
    const score = results.filter((e) => e.answer === input.kanjiId);

    return score.length
      ? score[0]
      : {
          answer: input.kanjiId,
          infosAnswer: { answeredRight: [], answeredWrong: [] },
        };
  },
  getScores: ({ input }) => {
    const result = utilsGetScores(input);

    return { scores: result };
  },
  getWorstScores: ({ input }) => {
    const result = utilsGetScores(input);

    const scores = result.filter((e) => e.infosAnswer.answeredWrong.length);

    return { scores };
  },
};

module.exports = actionsScores;
