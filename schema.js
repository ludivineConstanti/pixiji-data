const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
  allUsers: [User]
  getUser(input: InputUser): Feedback
  getScore(input: InputGetScore): Score
  getScores(input: InputGetScores): Scores
  getWorstScores(input: InputGetScores): Scores
  
}
type Mutation {
  createUser(input: InputUser): Feedback
  setScore(input: InputSetScore): Feedback
}
input InputUser {
  email: String
  password: String
}
type User {
  email: String
  password: String
}
input InputSetScore {
  email: String
  kanjiId: String
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
  infosAnswer: InfosAnswer
} 
type InfosAnswer {
  answeredRight: [String]
  answeredWrong: [String]
}
`);

module.exports = schema;
