import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';

function vrenderIndividualProvider(provider) {
  if(provider == null) {
    return(h('div')[
      h('h1', 'Loading provider')
    ]);
  }
  return h('section.right-panel', [
            h('a.thumbnail', [
              h('img', {"src": provider.images[0].url})
            ]),
            h('h3', provider.name),
            h('div', provider.district),
            h('p', provider.description)
  ]);
}

function vrenderSlotList(slots) {
  return h('section.right-panel', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(slots)
    .groupBy(x => x.customerId)
    .map((todoData) => {
      return h('list-slot.list-slot', {slot: todoData});
    }).value()
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

function vrenderNav() {
  return h('nav.navbar.navbar-default', [
      h('div.container-fluid', [
        h('div.navbar-header', [
            h('a.navbar-brand', 'Timma')
        ])
      ])
  ]);
}

function vrenderMapSection({slots: slots, setBounds: setBounds}) {
  return h('main-map', {
    markers: slots.map(x => new google.maps.LatLng(x.lastMinuteInfo.lat, x.lastMinuteInfo.lon))
      , setBounds: setBounds
    });
}


function vrenderMainSection({slots: slots, cities: cities, provider: provider, services:services, route: route}) {
  switch(route) {
    case '/slot_list': return vrenderSlotList(slots);
    case '/city_list': return vrenderCityList(cities);
    case '/slot_id': return vrenderIndividualProvider(provider);
    case '/landing': return vrenderServiceList(services);
    default: return vrenderSlotList(slots);
  }
}

export default function view(todos$) {
  return todos$.map(todos =>
      h('div.app-div', [
        vrenderNav(),
        vrenderMapSection(todos),
        vrenderMainSection(todos)
        //vrenderFooter(todos)
      ])
    );
};
