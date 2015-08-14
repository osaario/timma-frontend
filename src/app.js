import Cycle from '@cycle/core';
import CycleWeb from '@cycle/dom';
import {Rx} from '@cycle/core';
import todoItemComponent from './components/todo-item';
import googleMapComponent from './components/googlemap-component';
import listSlotComponent from './components/list-slot';
import cityItemComponent from './components/city-item';
import landingServiceItemComponent from './components/landing/landing-service-item';
import serviceItemComponent from './components/service-item';
import intent from './intents/todos' ;
import  { intent as landingIntent } from './intents/landing';
import model from './models/todos';
import landingView from './views/landing';
import mapView from './views/todos';
import {makeHTTPDriver} from '@cycle/http';
import makeRouterDriver from 'cycle-director';
import localStorageSink from './sinks/local-storage.js';

let home_route =  {
  url: '/',
  before: ()=>{console.log("Going home...");},
  on: ()=>{console.log("Welcome home");},
  after: ()=>{console.log("Leaving home...");}
};

let map_route = {
  url: '/map',
  on: ()=>{console.log("About this page...");}
};

let routes = [
  home_route,
  map_route
];

function main(drivers) {
  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots';
  let PROVIDER_URL = 'https://timma.fi/api/public/customers/';
  let SERVICES_URL = 'https://timma.fi/api/public/services/app';


  let intents = intent(drivers.DOM);

  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

  let services_req$ = Rx.Observable.just({
    url: SERVICES_URL,
    method: 'GET'
  });

  let provider_req$ = intents.thumbnailClick$.map((slot) => {
    return {
      url: PROVIDER_URL + slot.customerId,
      method: 'GET'
    };
  });

  let slots$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body)
   .startWith([]);

  let provider$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(PROVIDER_URL) === 0)
   .mergeAll()
   .map(res => res.body).startWith(null);

  let services$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SERVICES_URL) === 0)
   .mergeAll()
   .map(res => res.body).startWith([]);

  let data$ = model(intents,  {slots: slots$, provider: provider$, services: services$});

/*
  let view$ = ongoingContext$.combineLatest(services$, data$, (url, services, data) => {
    switch (url) {
      case '/': return landingView(services);
      default: return mapView(data);
    }
  });
  */

  let route$ = Rx.Observable.from(routes);

  let view$ = drivers.Router
  .combineLatest(services$, data$, (currentRoute, services, data) => {
    let view;
      switch (currentRoute) {
        case '/': return landingView(services);
        case '/map': return mapView(data);
      }
  });

  return {
    DOM: view$,
    Router: route$,
    HTTP:  Rx.Observable.merge(slot_req$, provider_req$, services_req$)
  };
}

Cycle.run(main, {
  DOM: CycleWeb.makeDOMDriver('#todoapp', {
    'todo-item': todoItemComponent,
    'landing-service-item': landingServiceItemComponent,
    'list-slot': listSlotComponent,
    'service-item': serviceItemComponent,
    'city-item': cityItemComponent,
    'main-map': googleMapComponent
  }),
  HTTP: makeHTTPDriver(),
  Router: makeRouterDriver({
    html5history: true // Remember to setup your server to handle this
  })
});
