const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
  allUsers: [User]
  getUser(user: InputUser): feedback
}
type Mutation {
  createUser(user: InputUser): feedback
  setScore(score: InputScore): feedback
}
type User {
  email: String
  password: String
}
input InputUser {
  email: String
  password: String
}
type UserScore {
  quizId: Int
  kanjiId: Int
  answeredWrong: Int
  answeredRight: Int
  score: Int
}
input InputScore {
  email: String
  kanjiId: String
  quizId: String
  isCorrect: Boolean
}
type feedback {
  message: String
  success: Boolean
}
`);

module.exports = schema;
