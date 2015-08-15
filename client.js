'use strict';
let Cycle = require('@cycle/core');
let {makeDOMDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {app, components} = require('./src/app');

function clientSideApp(responses) {
  let requests = app(responses);
  requests.DOM = requests.DOM.skip(1);
  return requests;
}

Cycle.run(clientSideApp, {
  DOM: makeDOMDriver('.app-container', components() ),
  HTTP: makeHTTPDriver(),
  context: () => Cycle.Rx.Observable.just(window.appContext)
});
