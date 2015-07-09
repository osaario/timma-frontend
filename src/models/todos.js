import {Rx} from '@cycle/core';

function model(intent, {slots: slots$, provider: provider$, services: services$}) {
  let route$ = Rx.Observable.merge(intent.thumbnailClick$.map(_ => 'thumbnail'),
  intent.serviceClick$.map(_ => 'service'),
  intent.mapBoundsChanged$.map(_ => 'bounds')).scan('/landing',
  (acc, elem) => {
    switch(elem) {
      case 'bounds':
        if(acc !== '/slot_id') return acc;
        else return '/slot_list';
      case 'service': return '/slot_list';
      case 'thumbnail': return '/slot_id';
      default: return '/landing';
    }
  }).startWith('/landing').map(_ => '/city_list');

  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, slots$, (bounds, slots) => {


      let filtered = _.filter(slots, (slot) => {
         return bounds != null ? bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon))
         : true;
      });

      let cities = _.chain(filtered)
      .uniq(s => s.lastMinuteInfo.city)
      .map((s) => {
        return {city: s.lastMinuteInfo.city, lat: s.lastMinuteInfo.lat, lon: s.lastMinuteInfo.lon};
      })
      .value();

      let filtered_services = _.chain(filtered)
      .map(s => s.services)
      .flatten().value();

      let counts = _.chain(filtered_services)
      .groupBy(s => s.serviceId)
      .mapValues(s => s.length)
      .value();

      let available_services = _.chain(filtered_services)
      .uniq(x => x.serviceId)
      .map(x => _.assign(x, {count: counts[x.serviceId]}))
      .sortBy(x => -x.count)
      .value();
      return  {slots: filtered, services: available_services, cities: cities};
  }).combineLatest(route$, provider$, services$, ({slots: slots, services: services, cities: cities}, route, provider, _) => {
      return {
        slots: slots,
        provider: provider,
        services: services,
        cities: cities,
        route: route
      };
  });

}

export default model;
