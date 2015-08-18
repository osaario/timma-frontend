import Cycle from '@cycle/core';
import CycleWeb from '@cycle/dom';
import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import intent from './intents/todos' ;
import  { intent as landingIntent } from './intents/landing';
import model from './models/todos';
import landing from './landing/landing';
import map from './map/map';
import localStorageSink from './sinks/local-storage.js';
import todoItemComponent from './components/todo-item';
import cityItemComponent from './components/city-item';
import landingServiceItemComponent from './components/landing/landing-service-item';
import serviceItemComponent from './components/service-item';


function vrenderNav() {
  return h('nav.navbar.navbar-default', [
      h('div.container-fluid', [
        h('div.navbar-header', [
              h('img', {'src': '/static/images/logo-vihreä.png' })
        ])
      ])
  ]);
}

function components() {
  return {
    'todo-item': todoItemComponent,
    'landing-service-item': landingServiceItemComponent,
    'service-item': serviceItemComponent,
    'city-item': cityItemComponent
  };
}

function app(drivers) {
  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots';
  let PROVIDER_URL = 'https://timma.fi/api/public/customers/';
  let SERVICES_URL = 'https://timma.fi/api/public/services/app';


  let intents = intent(drivers.DOM);

  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

/*
  let provider_req$ = intents.thumbnailClick$.map((slot) => {
    return {
      url: PROVIDER_URL + slot.customerId,
      method: 'GET'
    };
  });
  */

  let slots$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body)
   .startWith([]);

 console.log(drivers.HTTP);

  let routeFromClick$ = drivers.DOM.get('.link', 'click')
    .doOnNext(ev => ev.preventDefault())
    .map(ev => ev.currentTarget.attributes.href.value);

  let ongoingContext$ = drivers.route
    .merge(routeFromClick$).scan((acc, x) => {
      acc.route = x;
      return acc;
    });


    let mapApp = map(drivers);
    let mapHttp$ = mapApp.HTTP;
    let mapVtree$ = mapApp.DOM;

    let landingApp = landing(drivers);
    let landingHttp$ = landingApp.HTTP;
    let landingVtree$ = landingApp.DOM;

    let http$ = Rx.Observable.merge(landingHttp$, mapHttp$);

    let vtree$ = Rx.Observable
    .combineLatest(ongoingContext$, landingVtree$, mapVtree$,  (route, landingVtree, mapVtree ) => {
      /*
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', route);
      }*/
      return h('div.app-div', [
        vrenderNav(),
        (() => {
          if(route.match(/map\?serviceId=\d?/)) return mapVtree;
          else if(route === '/') return landingVtree;
          else return h('div', 'Unknown page');
        }
      )()
      ]);
    });
    /*
    let vtree$ = Rx.Observable.combineLatest(ongoingContext$, services$, (route, services) =>
    {
      console.log(services);
      return landingView(services);
    });
    */
  return {
    DOM: vtree$,
    HTTP: http$,
    route: ongoingContext$
  };
}


module.exports = {
  app,
  components
};
