import Cycle from '@cycle/core';
import CycleWeb from '@cycle/dom';
import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import intent from './intents/todos' ;
import  { intent as landingIntent } from './intents/landing';
import model from './models/todos';
import landing from './landing/landing';
import mapView from './views/todos';
import localStorageSink from './sinks/local-storage.js';
import todoItemComponent from './components/todo-item';
import googleMapComponent from './components/googlemap-component';
import listSlotComponent from './components/list-slot';
import cityItemComponent from './components/city-item';
import landingServiceItemComponent from './components/landing/landing-service-item';
import serviceItemComponent from './components/service-item';


function components() {
  return {
    'todo-item': todoItemComponent,
    'landing-service-item': landingServiceItemComponent,
    'list-slot': listSlotComponent,
    'service-item': serviceItemComponent,
    'city-item': cityItemComponent,
    'main-map': googleMapComponent
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

/*
  let provider$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(PROVIDER_URL) === 0)
   .mergeAll()
   .map(res => res.body).startWith(null);
   */

 console.log(drivers.HTTP);
//let services$ = Rx.Observable.just(0);
//  let data$ = model(intents,  {slots: slots$, provider: provider$, services: services$});

/*
  let view$ = ongoingContext$.combineLatest(services$, data$, (url, services, data) => {
    switch (url) {
      case '/': return landingView(services);
      default: return mapView(data);
    }
  });
  */

/*
  let view$ = drivers.Router
  .combineLatest(services$, data$, (currentRoute, services, data) => {
    let view;
      switch (currentRoute) {
        case '/': return landingView(services);
        case '/map': return mapView(data);
      }
  });
  */

  let routeFromClick$ = drivers.DOM.get('.link', 'click')
    .doOnNext(ev => ev.preventDefault())
    .map(ev => ev.currentTarget.attributes.href.value);

  let ongoingContext$ = drivers.context
    .merge(routeFromClick$).scan((acc, x) => {
      acc.route = x;
      return acc;
    });

/*
  let vtree$ = ongoingContext$
    .combineLatest(services$, ({route}, services ) => {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', route);
      }
      return landingView([]);
      /*
      switch (route) {
        case '/': return landingView(services);
        case '/map': return mapView(data);
        default: return h('div', 'Unknown page');
      }
    });
    */
    let landingApp = landing(drivers);
    let http$ = landingApp.HTTP;
    let vtree$ = landingApp.DOM;
    /*
    let vtree$ = Rx.Observable.combineLatest(ongoingContext$, services$, (route, services) =>
    {
      console.log(services);
      return landingView(services);
    });
    */
  return {
    DOM: vtree$,
    HTTP: http$
  };
}


module.exports = {
  app,
  components
};
