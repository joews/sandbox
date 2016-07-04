//
// Schema from the graphql quickstart
// http://graphql.org/docs/getting-started/
//
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} = require("graphql");

const users = require("./data/users.json");

// GraphQL types
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString }
  }
});

// GraphQL schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      user: {
        type: UserType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (_, args) => {
          return Promise.resolve(users[args.id]);
        }
      }
    }
  })
});

module.exports = schema;
