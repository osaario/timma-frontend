import {Rx} from '@cycle/core';

function model(intent, {slots: slots$, provider: provider$}) {
  let route$ = intent.thumbnailClick$.map((_) =>
  {
    return '/slot_id'
  }).startWith('/');
  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, slots$, (bounds, slots) => {

    if(bounds != null) {
      return _.filter(slots, slot => bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon)));
    }
    return slots;
  }).combineLatest(route$, provider$, (slots, route, provider) => {
      return {
        slots: slots,
        provider: provider,
        route: route
      };
  });

}

export default model;
