const express = require("express");
const graphqlServer = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} = require("graphql");

const userSchema = require("./user-schema.js");
const starWarsSchema = require("./star-wars-schema.js");

// const schema = userSchema;
const schema = starWarsSchema;

express()
  .use("/graphql", graphqlServer({ schema, pretty: true }))
  .listen(3000);

console.log("Started on port 3000");
