import Cycle from '@cycle/core';
import CycleWeb from '@cycle/web';
import {Rx} from '@cycle/core';
import todoItemComponent from './components/todo-item';
import googleMapComponent from './components/googlemap-component';
import listSlotComponent from './components/list-slot';
import cityItemComponent from './components/city-item';
import serviceItemComponent from './components/service-item';
import intent from './intents/todos';
import model from './models/todos';
import view from './views/landing';
import {makeHTTPDriver} from '@cycle/http';
import localStorageSink from './sinks/local-storage.js';

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

  let todos$ = model(intents,  {slots: slots$, provider: provider$, services: services$});

  return {
    DOM: view(todos$),
    HTTP:  Rx.Observable.merge(slot_req$, provider_req$, services_req$)
  };
}

Cycle.run(main, {
  DOM: CycleWeb.makeDOMDriver('#todoapp', {
    'todo-item': todoItemComponent,
    'list-slot': listSlotComponent,
    'service-item': serviceItemComponent,
    'city-item': cityItemComponent,
    'main-map': googleMapComponent
  }),
  HTTP: makeHTTPDriver()
});
