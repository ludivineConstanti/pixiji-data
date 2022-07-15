const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Query {
  getUser(input: InputUser): Feedback
  getScore(input: InputGetScore): Score
  getScores(input: InputGetScores): Scores
  getWorstScores(input: InputGetScores): Scores
  
}
type Mutation {
  createUser(input: InputUser): Feedback
  deleteUser(input: InputUser): Feedback
  setUserEmail(input: InputUserNewEmail): Feedback
  setUserPassword(input: InputUserNewPassword): Feedback
  setScore(input: InputSetScore): Feedback
}
input InputUser {
  email: String
  password: String
}
input InputUserNewEmail {
  email: String
  newEmail: String
  password: String
}
input InputUserNewPassword {
  email: String
  password: String
  newPassword: String
}
type User {
  email: String
  password: String
}
input InputSetScore {
  email: String
  kanjiId: String
  quizId: String
  isCorrect: Boolean
}
type Feedback {
  message: String
  success: Boolean
}
input InputGetScore { 
  email: String
  kanjiId: String
}
input InputGetScores { 
  email: String
}
type Scores {
  scores: [Score]
}
type Score {
  answer: Int
  quizId: Int
  infosAnswer: InfosAnswer
} 
type InfosAnswer {
  answeredRight: [String]
  answeredWrong: [String]
}
`);
