const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
  allUsers: [User]
  getUser(input: InputUser): Feedback
  getWorstScores(input: InputWorstScores): WorstScores
  
}
type Mutation {
  createUser(input: InputUser): Feedback
  setScore(input: InputScore): Feedback
}
input InputUser {
  email: String
  password: String
}
type User {
  email: String
  password: String
}
input InputScore {
  email: String
  kanjiId: String
  isCorrect: Boolean
}
type Feedback {
  message: String
  success: Boolean
}
input InputWorstScores { 
  email: String
}
type WorstScores {
  quiz1: [BadScore]
  quiz2: [BadScore]
  quiz3: [BadScore]
}
type BadScore {
  answer: Answer
  infosAnswer: InfosAnswer
}
type Answer {
  id: Int
  kanji: String
  en: String
  kana: String
  kanaEn: String
  quizId: Int
}
type InfosAnswer {
  answeredRight: Int
  answeredWrong: Int
}
`);

module.exports = schema;
