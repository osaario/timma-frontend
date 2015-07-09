import {Rx} from '@cycle/core';

function model(intent, {slots: slots$, provider: provider$, services: services$}) {
  let route$ = Rx.Observable.merge(intent.thumbnailClick$.map(_ => 'thumbnail'),
  intent.serviceClick$.map(_ => 'service'),
  intent.mapBoundsChanged$.map(_ => 'bounds'))
  .scan('/landing',
  (acc, elem) => {
    switch(elem) {
      case 'bounds':
        if(acc !== '/slot_id') return acc;
        else return '/slot_list';
      case 'service': return '/slot_list';
      case 'thumbnail': return '/slot_id';
      default: return '/landing';
    }
  }).startWith('/landing')
  .combineLatest(intent.mapBoundsChanged$.map(x => x.zoomLevel).map(x => x < 10).distinctUntilChanged(),
  (click, showCities) => {
    return showCities ? '/city_list' : click;
  });

  let setBounds$ = intent.mapBoundsChanged$.merge(intent.cityClick$.map((c) => {
   return {zoomLevel: 13, center: new google.maps.LatLng(c.lat, c.lon)};
 }));

  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, slots$, ({bounds: bounds}, slots) => {
      let filtered = _.filter(slots, (slot) => {
         return bounds != null ? bounds.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon))
         : true;
      });

      let cities = _.chain(filtered)
      .groupBy(s => s.lastMinuteInfo.city)
      .mapValues((slots) => {
        var bounds = new google.maps.LatLngBounds();
        slots.forEach((slot) =>
        {
          bounds.extend(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon))
        });
        return {city: slots[0].lastMinuteInfo.city, lat: bounds.getCenter().lat(), lon: bounds.getCenter().lng()};
      })
      .values()
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
  }).combineLatest(route$, provider$, services$, setBounds$, ({slots: slots, services: services, cities: cities}, route, provider, _, setBounds) => {
      return {
        slots: slots,
        provider: provider,
        services: services,
        cities: cities,
        route: route,
        setBounds: setBounds
      };
  });

}

export default model;
