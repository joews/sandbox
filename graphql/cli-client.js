const fetch = require("isomorphic-fetch");

function run(query) {
  const url = `http://localhost:3000/graphql?query=${query}`;

  return fetch(encodeURI(url))
    .then(response => response.json())
    .then(json => (console.log(json), json))
    .catch(e => console.error(e));
}

run(`{
  user(id: 1) {
    id, name
  }
}`)
