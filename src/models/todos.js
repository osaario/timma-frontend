import {Rx} from '@cycle/core';

function model(intent, {slots: slots$, provider: provider$, services: services$}) {
  let route$ = Rx.Observable.merge(intent.thumbnailClick$.map(x => 'thumbnail'),
  intent.serviceClick$.map(x => 'service'),
  intent.mapBoundsChanged$.map(x => 'bounds')).scan('/landing',
  (acc, elem) => {
    switch(elem) {
      case 'bounds':
        if(acc !== '/slot_id') return acc;
        else return '/slot_list';
      case 'service': return '/slot_list';
      case 'thumbnail': return '/slot_id';
      default: return '/landing';
    }
  }).startWith('/landing');

  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, slots$, (bounds, slots) => {

    if(bounds != null) {
      return _.filter(slots, slot => bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon)));
    }
    return slots;
  }).combineLatest(route$, provider$, services$, (slots, route, provider, services) => {
      return {
        slots: slots,
        provider: provider,
        services: services,
        route: route
      };
  });

}

export default model;
