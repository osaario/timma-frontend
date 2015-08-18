import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import Immutable from 'immutable';
import {propHook} from '../utils';
import TimmaMap from '../widgets/googlemap-widget';

function vrenderFilters(services, selectedService) {
  /*
  <div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    Dropdown
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
*/
let selectedServiceId = parseInt(selectedService);
return h('select#service-select', [
  services.map((service) => {
    if(selectedServiceId == service.serviceId) {
      return h('option', {value: `map?serviceId=${service.serviceId}`, attributes: {'selected': 'selected'}}, service.name);
    }
    else {
      return h('option', {value: `map?serviceId=${service.serviceId}`, attributes: {}}, service.name);
    }
  })
]);

}
function vrenderSlotList(slots) {
  return h('div#slot-list', {
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


function vrenderMapSection(slots, bounds) {
    return new TimmaMap(slots, bounds);
}


function vrenderMainSection(slots, services, selectedService) {
  return h('section.right-panel', [
    vrenderFilters(services, selectedService),
    vrenderSlotList(slots)
  ]);
    /*
  switch(route) {
    case '/city_list': return vrenderCityList(cities);
    case '/slot_id': return vrenderIndividualProvider(provider);
    case '/landing': return vrenderServiceList(services);
    default: return vrenderSlotList(slots);
  }
  */
}

function intent(drivers, initalBounds$, initalService$) {
  //mapBoundsChanged$: domDriver.get('#timma-map', 'bounds_changed').map(ev => ev.detail).throttle(500).startWith({bounds: null, zoomLevel: 14, center: null}).shareReplay(1),
  let bounds_change$ = drivers.DOM.get('#timma-map', 'bounds_changed').map(ev => ev.detail)
  .throttle(500)
  .map(({bounds}) => {
    console.log(bounds);
    return bounds;
  }).merge(initalBounds$.take(1));

  let service_changed$ = drivers.DOM.get('#service-select', 'change')
  .map((ev) => {
    //service select
    return ev.target.children[ev.target.selectedIndex].value;
  }).merge(initalService$.take(1));

  return {
    boundsChange$: bounds_change$,
    serviceChanged$: service_changed$
  };

}

function model(intent, data$, selectedService$) {
  return data$.combineLatest(selectedService$, (slots, selectedService) => {
    return Immutable.Seq(slots)
    .filter((slot) => {
      //return true;
      return Immutable.Seq(slot.services).find((s) => {
            return s.serviceId == selectedService;
        }) !== undefined;
    }).groupBy((slot) => {
      return slot.customerId;
    }).map((kvPair) => {
      return kvPair.toArray()[0];
    }).toArray();
  });
}

export default function map(drivers) {

  let SLOT_URL = 'https://timma.fi/api/public/lastminuteslots';

    //.map(ev => ev.target.value)

  let SERVICES_URL = 'https://timma.fi/api/public/services/app';

   let bounds$ = drivers.route.map((route) => {
     let b = route.match(/map\?serviceId=\d+,bounds=(\d+\.\d+,){4}/)[0]
     .match(/(\d+\.\d+,){4}/)[0]
     .split(',').splice(0,4).map((x) => {
       return parseFloat(x);
     });
     console.log(b);
     return b;
   });

   let selectedService$ = drivers.route.map((route) => {
     console.log('selected service' + route);
     return /\d+/.exec(route)[0];
   });
  let services_req$ = Rx.Observable.just({
    url: SERVICES_URL,
    method: 'GET'
  });
  let slot_req$ = Rx.Observable.just({
    url: SLOT_URL,
    method: 'GET'
  });
  let services$ = drivers.HTTP
  .filter(res$ => res$.request.url.indexOf(SERVICES_URL) === 0)
  .mergeAll()
  .map(res => res.body);

  let intentObj = intent(drivers, bounds$, selectedService$);
  let slots$ = model(intentObj, drivers.HTTP
   .filter(res$ => res$.request.url.indexOf(SLOT_URL) === 0)
   .mergeAll()
   .map(res => res.body), selectedService$);


   let dom$ = slots$.combineLatest(services$, selectedService$, bounds$,  (slots, services, selectedService, bounds) => {
      return h('section#map', [
        vrenderMapSection(slots, bounds),
        vrenderMainSection(slots, services, selectedService)
      ]);
   });
   let http$ = Rx.Observable.merge(slot_req$, services_req$);

   let outgoingRoute$ = Rx.Observable.combineLatest(intentObj.serviceChanged$, intentObj.boundsChange$, (service, bounds) => {
     var string = `/map?serviceId=${service},bounds=`;
     bounds.forEach((bound) => {
       string += bound + ',';
     });
     return string;
   });
  return {
    DOM: dom$,
    HTTP: http$,
    route: outgoingRoute$
  };
}
