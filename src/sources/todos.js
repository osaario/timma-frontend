import {Rx} from '@cycle/core';


function getServiceSlots () {
  return $.ajax({
    url: 'https://timma.fi/api/public/lastminuteslots/service/101?city=Helsinki',
  }).promise();
};

let serviceSlotsData = Rx.Observable.fromPromise(getServiceSlots());

export default {
  todosData$: serviceSlotsData
};
