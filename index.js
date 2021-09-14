const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { graphql } = require("graphql");
const cors = require("cors");
const bcrypt = require("bcrypt");
// const dotenv = require("dotenv").config();

const schema = require("./schema");

// data
let users = [];
const userScores = [];

const actionsUser = {
  allUsers: () => users,

  createUser: async ({ user }) => {
    const feedback = {
      success: false,
      message: "Sorry, the request was not processed",
    };

    const existingUser = users.filter((e) => e.email === user.email)[0];

    if (existingUser) {
      feedback.message =
        "Looks like you already have an account, click on the button below to go to the login page.";
      return feedback;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    users.push({ email: user.email, password: hashedPassword });
    feedback.success = true;
    feedback.message =
      "Great! You are now registered! You can go to the quizzes page by clicking on the button below.";

    return feedback;
  },

  getUser: async ({ user }) => {
    const match = users.filter((e) => e.email === user.email)[0];
    const feedback = {
      success: false,
      message: "Sorry, the request was not processed",
    };
    if (!match) {
      feedback.message = "Sorry, this account does not exist.";
      return feedback;
    }
    // first argument is password that we get from form (not encrypted)
    // second argument is password from database (crypted)
    const validPassword = await bcrypt.compare(user.password, match.password);
    if (!validPassword) {
      feedback.message = "Sorry, this password is incorrect.";
      return feedback;
    }
    feedback.success = true;
    feedback.message =
      "Great! You are now logged in! You can go to the quizzes page by clicking on the button below.";
    return feedback;
  },
};

const actionsScore = {
  setScore: ({ score }) => {
    const user = userScores.filter((e) => e.email === score.email)[0];
    const kanjiScore = {
      kanjiId: score.kanjiId,
      quizId: score.quizId,
      answeredRight: score.isCorrect ? 1 : 0,
      answeredWrong: score.isCorrect ? 0 : 1,
      score: score.isCorrect ? 1 : -1,
    };
    if (!user) {
      userScores.push({
        email: score.email,
        kanjis: [kanjiScore],
      });
      return {
        success: true,
        message:
          "This is the first answer that was registered on your account, congratulation!",
      };
    }
    const currentKanji = user.kanjis.filter((e) => e.kanjiId === score.kanjiId);
    if (!currentKanji) {
      user.kanjis.push(kanjiScore);
      return {
        success: true,
        message: "This is the first answer that was registered For this Kanji",
      };
    }
    if (isCorrect) {
      currentKanji.answeredRight += 1;
      currentKanji.score += 1;
      return {
        success: true,
        message: "Great, your score augmented by 1 point",
      };
    }
    if (!isCorrect) {
      currentKanji.answeredWrong += 1;
      currentKanji.score -= 1;
      return { success: true, message: "Your score decreased by 1 point" };
    }
    return {
      success: false,
      message: "None of the given options were triggered",
    };
  },
};

const root = {
  ...actionsUser,
  ...actionsScore,
};

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);
