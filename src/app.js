import Cycle from '@cycle/core';
import CycleWeb from '@cycle/web';
import {Rx} from '@cycle/core';
import todoItemComponent from './components/todo-item';
import googleMapComponent from './components/googlemap-component';
import source from './sources/todos';
import googleMapDriver from './drivers/googlemap';
import intent from './intents/todos';
import model from './models/todos';
import view from './views/todos';
import localStorageSink from './sinks/local-storage.js';

function main(drivers) {
  let todos$ = model(intent(drivers.DOM), source);
  /*
  drivers.googleMap.markers(todos$);
  drivers.googleMap.bounds$.subscribe(function(x){
    console.log(x);
  });
  */
  return view(todos$);
}

Cycle.run(main, {
  DOM: CycleWeb.makeDOMDriver('#todoapp', {
    'todo-item': todoItemComponent,
    'main-map': googleMapComponent
  })
});
