const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { graphql } = require("graphql");
const cors = require("cors");

const schema = require("./schema");
const actionsUsers = require("./actions/users");
const actionsScores = require("./actions/scores");

const root = {
  ...actionsUsers,
  ...actionsScores,
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
