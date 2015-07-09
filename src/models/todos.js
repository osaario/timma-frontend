import {Rx} from '@cycle/core';

function model(intent, {slots: slots$, provider: provider$, services: services$}) {
  let route$ = Rx.Observable.combineLatest(intent.thumbnailClick$.timestamp().map(x => _.assign(x, {route: '/slot_id'})),
  intent.serviceClick$.timestamp().map(x => _.assign(x, {route: '/slot_list'})),
  intent.mapBoundsChanged$.timestamp().map(x => _.assign(x, {route: '/slot_list'})),
  (tnClick, sClick, boundsC) => {
    _.sort([tnClick,sClick,boundsC], xx => xx.timestamp)[0].route;
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
