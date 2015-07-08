import Cycle from '@cycle/core';
import CycleWeb from '@cycle/web';
import {Rx} from '@cycle/core';
import todoItemComponent from './components/todo-item';
import googleMapComponent from './components/googlemap-component';
import listSlotComponent from './components/list-slot';
import intent from './intents/todos';
import model from './models/todos';
import view from './views/todos';
import {makeHTTPDriver} from '@cycle/http';
import localStorageSink from './sinks/local-storage.js';

function main(drivers) {
  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots/service/101?city=Helsinki';
  let PROVIDER_URL = 'https://timma.fi/api/public/customers/';
  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

  let intents = intent(drivers.DOM);

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

  let todos$ = model(intents,  {slots: slots$, provider: provider$});

  return {
    DOM: view(todos$),
    HTTP:  Rx.Observable.merge(slot_req$, provider_req$)
  };
}

Cycle.run(main, {
  DOM: CycleWeb.makeDOMDriver('#todoapp', {
    'todo-item': todoItemComponent,
    'list-slot': listSlotComponent,
    'main-map': googleMapComponent
  }),
  HTTP: makeHTTPDriver()
});
