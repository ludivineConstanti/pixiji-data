const bcrypt = require("bcrypt");

let dataUsers: { email: string; password: string }[] = [];

const util = {
  returnEncryptedPassword: async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
};

const checks = {
  emailShouldNotExist: (existingUser: object | undefined) => {
    if (existingUser) {
      return {
        success: false,
        message:
          "Looks like you already have an account, the same email address can not be used again.",
      };
    }
  },
  emailShouldExist: (existingUser: object | undefined) => {
    if (!existingUser) {
      return {
        success: false,
        message: "Sorry, looks like this account does not exist.",
      };
    }
  },
  passwordIsCorrect: (validPassword: boolean) => {
    if (!validPassword) {
      return {
        success: false,
        message: "Sorry, this password is not your current password.",
      };
    }
  },
};

module.exports = {
  createUser: async ({
    input,
  }: {
    input: { email: string; password: string };
  }) => {
    const { email, password } = input;
    let triggeredCheck;

    const existingUser = dataUsers.find((e) => e.email === email);

    triggeredCheck = checks.emailShouldNotExist(existingUser);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const hashedPassword = await util.returnEncryptedPassword(password);

    dataUsers.push({ email, password: hashedPassword });

    return {
      success: true,
      message:
        "Great! You are now registered! You can now go to the quizzes page to test your kanji knowledge.",
    };
  },
  deleteUser: async ({
    input,
  }: {
    input: { email: string; password: string };
  }) => {
    const { email, password } = input;
    let triggeredCheck;

    const existingUser = dataUsers.find((e) => e.email === email);

    triggeredCheck = checks.emailShouldExist(existingUser);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    triggeredCheck = checks.passwordIsCorrect(validPassword);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    dataUsers = dataUsers.filter((e) => e.email !== email);

    return {
      success: true,
      message: "Your account was successfully deleted.",
    };
  },
  setUserEmail: async ({
    input,
  }: {
    input: { email: string; newEmail: string; password: string };
  }) => {
    const { email, newEmail, password } = input;
    let triggeredCheck;

    const userWithNewEmail = dataUsers.find((e) => e.email === newEmail);

    triggeredCheck = checks.emailShouldNotExist(userWithNewEmail);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const existingUser = dataUsers.find((e) => e.email === email);

    triggeredCheck = checks.emailShouldExist(existingUser);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    triggeredCheck = checks.passwordIsCorrect(validPassword);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    existingUser.email = newEmail;

    return {
      success: true,
      message: `Your email address is now ${newEmail}.`,
    };
  },
  setUserPassword: async ({
    input,
  }: {
    input: { email: string; password: string; newPassword: string };
  }) => {
    const { email, password, newPassword } = input;
    let triggeredCheck;

    const existingUser = dataUsers.find((e) => e.email === email);

    triggeredCheck = checks.emailShouldExist(existingUser);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    triggeredCheck = checks.passwordIsCorrect(validPassword);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    const hashedNewPassword = await util.returnEncryptedPassword(newPassword);

    existingUser.password = hashedNewPassword;

    return {
      success: true,
      message: `Your password has been successfully updated.`,
    };
  },
  getUser: async ({
    input,
  }: {
    input: { email: string; password: string };
  }) => {
    const { email, password } = input;
    let triggeredCheck;

    const match = dataUsers.find((e) => e.email === email);

    triggeredCheck = checks.emailShouldExist(match);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    // first argument is password that we get from form (not encrypted)
    // second argument is password from database (crypted)
    const validPassword = await bcrypt.compare(password, match.password);

    triggeredCheck = checks.passwordIsCorrect(validPassword);
    if (triggeredCheck) {
      return triggeredCheck;
    }

    return {
      success: true,
      message:
        "Great! You are now logged in! You can go to the quizzes page by clicking on the button below.",
    };
  },
};
