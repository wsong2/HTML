import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

// https://graphql.org/graphql-js/running-an-express-graphql-server/
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`)

/*
e.g.

{
  quoteOfTheDay
}

{
  random
}

{
  rollThreeDice
}
*/

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  },
}

var appGQ = express();
appGQ.use(
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)

export default function() {
	return appGQ;
}
