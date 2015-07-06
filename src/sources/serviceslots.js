import {Rx} from '@cycle/core';


function getServiceSlots () {
  return $.get('https://timma.fi/api/public/lastminuteslots/service/101?city=Helsinki').promise();
}

// get serviceslots from backend
export default {
  serviceSlots$: Rx.Observable.fromPromise(getServiceSlots)
};
