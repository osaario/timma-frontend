'use strict';
let Cycle = require('@cycle/core');
let {makeDOMDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {app} = require('./src/app');
import todoItemComponent from './src/components/todo-item';
import googleMapComponent from './src/components/googlemap-component';
import listSlotComponent from './src/components/list-slot';
import cityItemComponent from './src/components/city-item';
import landingServiceItemComponent from './src/components/landing/landing-service-item';
import serviceItemComponent from './src/components/service-item';

function clientSideApp(responses) {
  let requests = app(responses);
  requests.DOM = requests.DOM.skip(1);
  return requests;
}

Cycle.run(clientSideApp, {
  DOM: makeDOMDriver('.app-container', {
    'todo-item': todoItemComponent,
    'landing-service-item': landingServiceItemComponent,
    'list-slot': listSlotComponent,
    'service-item': serviceItemComponent,
    'city-item': cityItemComponent,
    'main-map': googleMapComponent
  }),
  HTTP: makeHTTPDriver(),
  context: () => Cycle.Rx.Observable.just(window.appContext)
});
