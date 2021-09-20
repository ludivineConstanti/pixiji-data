const dataKanjis = require("../data/kanjis");
const dataQuizzes = require("../data/quizzes");
const dataScores = [];

const utils = {
  getUserScore: (email) => dataScores.filter((e) => e.email === email)[0],
};

const actionsScores = {
  setScore: ({ input }) => {
    const { email, kanjiId, isCorrect } = input;
    const currentKanji = dataKanjis.filter((e) => e.id === +kanjiId)[0];

    const user = utils.getUserScore(email);
    const kanjiScore = {
      answer: {
        ...currentKanji,
      },
      infosAnswer: {
        answeredRight: isCorrect ? 1 : 0,
        answeredWrong: isCorrect ? 0 : 1,
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
      currentKanjiScore.infosAnswer.answeredRight += 1;
      return {
        success: true,
        message: "Great, your score augmented by 1 point",
      };
    }
    if (!isCorrect) {
      currentKanjiScore.infosAnswer.answeredWrong += 1;
      return { success: true, message: "Your score decreased by 1 point" };
    }
    return {
      success: false,
      message: "None of the given options were triggered",
    };
  },
  getWorstScores: ({ input }) => {
    const { email } = input;
    const worstScores = {};

    const userScore = utils.getUserScore(email);
    if (!userScore) {
      dataQuizzes.forEach((quiz) => {
        worstScores[`quiz${quiz.id}`] = [];
      });
      return worstScores;
    }

    dataQuizzes.forEach((quiz) => {
      const quizScore = userScore.kanjis.filter(
        (e) => e.answer.quizId === quiz.id
      );
      if (!quizScore) {
        worstScores[`quiz${quiz.id}`] = [];
      }
      if (quizScore) {
        const currentWorstScore = [];

        quizScore.sort((a, b) => {
          return (
            a.answeredWrong -
            a.answeredRight -
            (b.answeredWrong - b.answeredRight)
          );
        });
        const itemNum = Math.ceil(
          dataKanjis.filter((e) => e.quizId === quiz.id).length / 12
        );

        for (let i = 0; i < itemNum && i < quizScore.length; i++) {
          currentWorstScore.push(quizScore[i]);
        }
        worstScores[`quiz${quiz.id}`] = currentWorstScore;
      }
    });

    return worstScores;
  },
};

module.exports = actionsScores;
