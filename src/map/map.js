import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Immutable from 'immutable';
import {propHook} from '../utils';
import TimmaMap from '../widgets/googlemap-widget';

function vrenderSlotList(slots) {
  return h('section.right-panel', {
    style: {'display': ''}
  }, [ h('ul.list-group',
  Immutable.List(slots)
  .groupBy(x => x.customerId)
    .map((todoData) => {
      return h('list-slot.list-slot', {slot: todoData});
    })
  )]);
}

function vrenderCityList(cities) {
  return h('section.right-panel', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(cities)
    .map((city) => {
      return h('city-item.city-item', {city: city});
    }).value()
  )]);
}

function vrenderServiceList(services) {
  return h('section.right-panel', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(services)
    .map((service) => {
      return h('service-item.service-item', {service: service});
    }).value()
  )]);
}

function vrenderMapSection(slots) {
    return new TimmaMap(slots, null);
}


function vrenderMainSection({slots: slots, cities: cities, provider: provider, services:services, route: route}) {
    return vrenderSlotList(slots);
    /*
  switch(route) {
    case '/city_list': return vrenderCityList(cities);
    case '/slot_id': return vrenderIndividualProvider(provider);
    case '/landing': return vrenderServiceList(services);
    default: return vrenderSlotList(slots);
  }
  */
}

export default function map(drivers) {

  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots';

  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

  let slots$ = drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body);

   let dom$ = slots$.map((slots) => {
      return h('section#map', [
        vrenderMapSection(slots),
        vrenderMainSection(slots)
        //vrenderFooter(todos)
      ]);
   });
   let http$ = slot_req$;

  return {
    DOM: dom$,
    HTTP: http$
  };
}
