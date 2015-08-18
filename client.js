'use strict';
let Cycle = require('@cycle/core');
let {makeDOMDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {makeRouteDriver} = require('./src/drivers/routeDriver');
let {app, components} = require('./src/app');

function clientSideApp(responses) {
  let requests = app(responses);
  requests.DOM = requests.DOM;
  return requests;
}

Cycle.run(clientSideApp, {
  DOM: makeDOMDriver('.app-container', components() ),
  HTTP: makeHTTPDriver(),
  route: makeRouteDriver(window.appContext)
});
