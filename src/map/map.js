import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Immutable from 'immutable';
import {propHook} from '../utils';
import TimmaMap from '../widgets/googlemap-widget';

function vrenderSlotList(slots) {
  return h('section.right-panel', {
    style: {'display': ''}
  }, [ h('ul.list-group',
  /*
  Immutable.List(slots)
  .groupBy(x => x.customerId)
  */
  slots.map((slot) => {
    return h('li.list-group-item', [
      h('a.thumbnail.slot-thumbnail.list-slot-clickable', [
        h('img.slot-img', {"src": slot.lastMinuteInfo.imageUrl})
      ]),
      h('h3', slot.lastMinuteInfo.customerName),
      h('div', slot.lastMinuteInfo.district)
    ]);
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
    return new TimmaMap(slots);
}


function vrenderMainSection(slots) {
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

function intent(drivers, isClient) {
  if(isClient) {
    //mapBoundsChanged$: domDriver.get('#timma-map', 'bounds_changed').map(ev => ev.detail).throttle(500).startWith({bounds: null, zoomLevel: 14, center: null}).shareReplay(1),
    let bounds_change$ = drivers.DOM.get('#timma-map', 'bounds_changed').map(ev => ev.detail)
    .throttle(500)
    .startWith({bounds: null, zoomLevel: 14, center: null});
  return {
    boundsChange$: bounds_change$
  };
  } else {
  return {
    boundsChange$: Rx.Observable.just(0)
  };
  }

}

function model(intent, data$) {
  return intent.boundsChange$.combineLatest(data$, (bounds, slots) => {
    return slots;
  });
}

export default function map(drivers) {

  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots';

  let isClient = typeof window !== 'undefined' ? true : false;
    //.map(ev => ev.target.value)

  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });

  let slots$ = model(intent(drivers, isClient), drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body));

   let dom$ = slots$.map((slots) => {
      return h('section#map', [
        (() => {
          if(isClient) {
            return vrenderMapSection(slots);
          }
      })(),
        vrenderMainSection(slots)
      ]);
   });
   let http$ = slot_req$;

  return {
    DOM: dom$,
    HTTP: http$
  };
}
