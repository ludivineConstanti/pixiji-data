const bcrypt = require("bcrypt");

const dataUsers = [];

const actionsUsers = {
  allUsers: () => dataUsers,

  createUser: async ({ input }) => {
    const { email, password } = input;

    const feedback = {
      success: false,
      message: "Sorry, the request was not processed",
    };

    const existingUser = dataUsers.filter((e) => e.email === email)[0];

    if (existingUser) {
      feedback.message =
        "Looks like you already have an account, click on the button below to go to the login page.";
      return feedback;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    dataUsers.push({ email, password: hashedPassword });
    feedback.success = true;
    feedback.message =
      "Great! You are now registered! You can go to the quizzes page by clicking on the button below.";

    return feedback;
  },

  getUser: async ({ input }) => {
    const { email, password } = input;

    const match = dataUsers.filter((e) => e.email === email)[0];
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
    const validPassword = await bcrypt.compare(password, match.password);
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

module.exports = actionsUsers;
