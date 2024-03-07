import express from 'express';
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { promises as fs } from 'fs';

// https://graphql.org/graphql-js/running-an-express-graphql-server/
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  scalar JSON
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int]
    getObject: JSON
    getJsonData: JSON
    getFile(fileName: String): JSON
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
  rollDice(numDice: 3, numSides: 6)
}

{
  getFile(fileName: "grid1.json")
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
  rollDice: ({ numDice, numSides }) => {
    var output = []
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)))
    }
    return output
  },
  getObject: () => {
    return {
      name: "jshua",
      age: "30",
      place: "china",
      gender: "Male"
    }
  },
  getJsonData: () => {
    return {
      name: "jshua",
      age: "30",
      place: "china",
      gender: "Male"
    }
  },
  getFile: ({ fileName }) => {
      async function example() {
        try {
          const data = await fs.readFile('../restsvr/controllers/data/' + fileName, { encoding: 'utf8' });
          return JSON.parse(data);
          //return data;
        } catch (err) {
          //console.log(err);
          return {
            err: err
          }
        }
      }
      return example();
    }
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
