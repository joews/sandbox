const fetch = require("isomorphic-fetch");

function getUrl(query, variables) {
  const urlRoot = `http://localhost:3000/graphql?query=${query}`;

  if (variables == null) {
    return urlRoot;
  } else {
    return urlRoot + `&variables=${JSON.stringify(variables)}`;
  }
}

function run(query, variables) {
  const url = getUrl(query, variables)

  return fetch(encodeURI(url))
    .then(response => response.json())
    .then(json => (console.log(JSON.stringify(json, null, 2)), json))
    .catch(e => console.error(e));
}

// Single operation query
run(`{
  hero {
    name
  }
}`)

// Query Operations cna have names, but that's only
//  required when a query has several operations.
// This one has a name, but only one op.
// The response looks the same as an un-named operation.
run(`
query HeroNameQuery {
  hero {
    name
  }
}`);

// Requests more fields, including some deeply-nested members
//  of the `friends` property.
// The syntax is like a relaxed version of JSON without values
run(`{
  hero {
    id
    name
    friends {
      id, name
    }
  }
}`);

// GraphQL is designed for deeply-nested queries, hence "Graph".
run(`{
  hero {
    name
    friends {
      name
      appearsIn
      friends {
        name
      }
    }
  }
}`);

// Pass hard-coded parameters...
run(`{
  human(id: "1000") {
    name
  }
}`)

// ... or typed runtime query parameters.
// parameter names start with $
// the sigil isn't included in the passed variable name
run(`
query HumanById($id: String!) {
  human(id: $id) {
    name
  }

}`, { id: "1001" })

// fields can be aliased
// The field names in the response will be called `luke` and leia`, not `human`.
// Aliases are required to fetch the same field several times - using
///  "human" twice is invalid.
run(`{
  luke: human(id: "1003") {
    name
  },
  leia: human(id: "1000") {
    name
  }
}`);

// Common parts of queries can be extracted into fragmments
//  with a syntax like Object rest params
run(`
  fragment HumanFragment on Human {
    name, homePlanet
  }

  {
    luke: human(id: "1000") {
      ...HumanFragment
    },
    leia: human(id: "1003") {
      ...HumanFragment
    }
  }
`)

// The speciala field __typename identifies the result object's type.
// This is especially useful for interface fields.
run(`
  fragment HeroFragment on Character {
    name
    __typename
  }

  {
    hope: hero(episode: NEWHOPE) {
      ...HeroFragment
    },
    empire: hero(episode: EMPIRE) {
      ...HeroFragment
    },
    jedi: hero(episode: JEDI) {
      ...HeroFragment
    },
    hero {
      ...HeroFragment
    }
  }
`)
