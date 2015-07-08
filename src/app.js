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
  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

  let providerClick$ = drivers.DOM.get('.thumbnail', 'click')
    .doOnNext(ev => ev.preventDefault())
    .map(ev => ev.currentTarget.attributes.img.src)

  let slots$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body)
   .startWith([]);

  let todos$ = model(intent(drivers.DOM), slots$);
  return {
    DOM: view(todos$),
    HTTP: slot_req$
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
