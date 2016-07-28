"use strict";

const {div, label, input, hr, h1, makeDOMDriver} = CycleDOM

function main(sources) {
  const sinks = {
    DOM: sources.DOM.select('.field').events('input')
      .map(ev => ev.target.value)
      .startWith('')
      .map(name =>
        div([
          label('Name:'),
          input('.field', {attributes: {type: 'text'}}),
          hr(),
          h1('Hello there ' + name),
        ])
      )
  };
  return sinks;
}

Cycle.run(main, { DOM: makeDOMDriver('#app-container') })
