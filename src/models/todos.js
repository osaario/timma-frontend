import {Rx} from '@cycle/core';

function model(intent, source) {
  let route$ = intent.thumbnailClick$.scan((acc, slot) =>
  {
    return '/slot_id'
  }).startWith('/');
  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, source, (bounds, slots) => {

    if(bounds != null) {
      return _.filter(slots, slot => bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon)));
    }
    return slots;
  }).combineLatest(route$, (slots, route) => {
      return {
        slots: slots,
        route: route
      };
  });

}

export default model;
