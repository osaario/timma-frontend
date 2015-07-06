import {Rx} from '@cycle/core';

function merge() {
  let result = {};
  for (let i = 0; i < arguments.length; i++) {
    let object = arguments[i];
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        result[key] = object[key];
      }
    }
  }
  return result;
}

let defaultTodosData = {
  list: [],
  input: '',
  filter: '',
  filterFn: () => true // allow anything
};

function getServiceSlots () {
  return $.ajax({
    url: 'https://timma.fi/api/public/lastminuteslots/service/101?city=Helsinki',
  }).promise();
};


let storedTodosData = JSON.parse(localStorage.getItem('todos-cycle')) || {};

let initialTodosData = merge(defaultTodosData, storedTodosData);

let serviceSlotsData = Rx.Observable.fromPromise(getServiceSlots());

export default {
  todosData$: serviceSlotsData
};
