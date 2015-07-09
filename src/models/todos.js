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

      let filtered = _.filter(slots, (slot) => {
         return bounds != null ? bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon))
         : true;
      });

      let filtered_services = _.chain(filtered)
      .map(s => s.services)
      .flatten().value();

      let counts = _.chain(filtered_services)
      .groupBy(s => s.serviceId)
      .map(s => s.length)
      .value();

      let available_services = _.chain(filtered_services)
      .uniq(x => x.serviceId)
      .map(x => _.assign(x, {count: counts[x.serviceId]}))
      .sort(x => x.count)
      .value();
      return  {slots: filtered, services: available_services};
  }).combineLatest(route$, provider$, services$, ({slots: slots, services: services}, route, provider, _) => {
      return {
        slots: slots,
        provider: provider,
        services: services,
        route: route
      };
  });

}

export default model;
