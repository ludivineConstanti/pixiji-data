const dummyUser = require("../data/dummyUser");

interface KanjiScoreProps {
  answer: number;
  infosAnswer: {
    answeredRight: string[];
    answeredWrong: string[];
  };
}

const dataScores: { email: string; kanjis: KanjiScoreProps[] }[] = [dummyUser];

const utilsGetUserScore = (email: string) =>
  dataScores.filter((e) => e.email === email)[0];
const utilsGetScores = (input: { email: string }) => {
  const { email } = input;

  const userScore = utilsGetUserScore(email);
  if (!userScore) {
    return [];
  }

  return userScore.kanjis;
};

const returnformattedDate = () => {
  return new Date().toISOString().slice(0, 10);
};

module.exports = {
  setScore: ({
    input,
  }: {
    input: { email: string; kanjiId: number; isCorrect: boolean };
  }) => {
    const { email, kanjiId, isCorrect } = input;
    const date = returnformattedDate();

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

    const currentKanjiScore = user.kanjis.find((e) => +e.answer === +kanjiId);

    if (!currentKanjiScore) {
      user.kanjis.push(kanjiScore);
      return {
        success: true,
        message: "This is the first answer that was registered For this Kanji",
      };
    } else if (currentKanjiScore) {
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
    }
    return {
      success: false,
      message: "None of the given options were triggered",
    };
  },
  getScore: ({ input }: { input: { email: string; kanjiId: number } }) => {
    const results = utilsGetScores(input);
    const score = results.find((e) => e.answer === input.kanjiId);

    return score
      ? score
      : {
          answer: input.kanjiId,
          infosAnswer: { answeredRight: [], answeredWrong: [] },
        };
  },
  getScores: ({ input }: { input: { email: string } }) => {
    const result = utilsGetScores(input);

    return { scores: result };
  },
  getWorstScores: ({ input }: { input: { email: string } }) => {
    const result = utilsGetScores(input);

    const scores = result.filter((e) => e.infosAnswer.answeredWrong.length);

    return { scores };
  },
};
