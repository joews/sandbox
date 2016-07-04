const {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
} = require("graphql");

const { getFriends, getHero, getHuman, getDroid } = require("./data/starWarsData.js");


//
// Types
//
const episodeEnum = new GraphQLEnumType({
  name: "Episode",
  description: "One of the films in the Star Wars Trilogy",
  values: {
    NEWHOPE: {
      value: 4,
      description: "Released in 1977.",
    },
    EMPIRE: {
      value: 5,
      description: "Released in 1980.",
    },
    JEDI: {
      value: 6,
      description: "Released in 1983.",
    },
  }
});

const characterInterface = new GraphQLInterfaceType({
  name: "Character",
  description: "A character in the Star Wars Trilogy",

  // why is this a function?
  fields: () => ({
    id: {
      // Fields are nullable by default
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the character.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the character.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description: "The friends of the character, or an empty list if they " +
                   "have none.",
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "All secrets about their past.",
    }
  }),

  // Return the Type of the given instance object
  // Fulfils the __typename query field

  resolveType: (character) => {
    return getHuman(character.id) ? humanType : droidType
  }
});

const humanType = new GraphQLObjectType({
  name: "Human",
  description: "A humanoid creature in the Star Wars universe.",
  interfaces: [characterInterface],
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the human.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the human.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description: "The friends of the human, or an empty list if they " +
                   "have none.",
      resolve: human => getFriends(human),
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    homePlanet: {
      type: GraphQLString,
      description: "The home planet of the human, or null if unknown.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "Where are they from and how they came to be who they are.",
      resolve: () => {
        throw new Error("secretBackstory is secret.");
      },
    },
  }),
});

const droidType = new GraphQLObjectType({
  name: "Droid",
  description: "A mechanical creature in the Star Wars universe.",
  interfaces: [ characterInterface ],

  // fields is an Object or a () => Object.
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the droid.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the droid.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description: "The friends of the droid, or an empty list if they " +
                   "have none.",
      resolve: droid => getFriends(droid),
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "Construction date and the name of the designer.",
      resolve: () => {
        throw new Error("secretBackstory is secret.");
      },
    },
    primaryFunction: {
      type: GraphQLString,
      description: "The primary function of the droid.",
    },
  },
});



//
// Query type
// The entry point into the schema.
// Advertises the available queries.
//
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    hero: {
      // The type (in our schema) that this query returns
      type: characterInterface,

      // The arguments that this query accepts
      args: {
        episode: {
          description: "If omitted, returns the hero of the whole saga. If " +
                       "provided, returns the hero of that particular episode.",

          // the type is not explicitly marked as non-nullable,
          //  so it is optiona;
          type: episodeEnum
        }
      },

      // A function that returns [a Promise for] data that fufils this field for a query
      // TODO what is the first arg?
      resolve: (root, { episode }) => getHero(episode),
    },

    human: {
      type: humanType,
      args: {
        id: {
          description: "id of the human",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => getHuman(id),
    },

    droid: {
      type: droidType,
      args: {
        id: {
          description: "id of the droid",
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => getDroid(id),
    },
  })
});

//
// Schema
//

// GraphQL schemas expose their entry point
const schema = new GraphQLSchema({
  query: queryType,

  // TODO what is the purpose of the `types` arg?
  types: [humanType, droidType]
});

module.exports = schema;
