import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';

function vrenderIndividualProvider(provider) {
  if(provider == null) {
    return(h('div')[
      h('h1', 'Loading provider')
    ]);
  }
  return h('section#main', {
    style: {'display': ''}
  }, [ h('div.container', [
        h('div.row', [
          h('div.col-sm-3', [
            h('a.thumbnail', [
              h('img', {"src": provider.images[0].url})
            ]),
          ]),
          h('div.col-sm-9', [
            h('h3', provider.name),
            h('div', provider.district)
          ]),
        ]),
        h('div.row', [
          h('div.col-sm-12', [
            h('p', provider.description)
          ]),
        ])
      ]
    )
  ]);
}

function vrenderSlotList(slots) {
  return h('section#main', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(slots)
    .groupBy(x => x.customerId)
    .map((todoData) => {
      return h('list-slot.list-slot', {slot: todoData});
    }).value()
  )]);
}

function vrenderServiceList(services) {
  return h('section#main', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(services)
    .map((service) => {
      return h('service-item.service-item', {service: service});
    }).value()
  )]);
}

function vrenderMapSection({slots: slots}) {
  return h('main-map', {markers:
      slots.map((x) =>  {
        return new google.maps.LatLng(x.lastMinuteInfo.lat, x.lastMinuteInfo.lon);
      })
    });
}


function vrenderMainSection({slots: slots, provider: provider, services:services, route: route}) {
  switch(route) {
    case '/slot_list': return vrenderSlotList(slots);
    case '/slot_id': return vrenderIndividualProvider(provider);
    case '/landing': return vrenderServiceList(services);
    default: return vrenderSlotList(slots);
  }
}

export default function view(todos$) {
  return todos$.map(todos =>
      h('div', [
        vrenderMapSection(todos),
        vrenderMainSection(todos)
        //vrenderFooter(todos)
      ])
    );
};
