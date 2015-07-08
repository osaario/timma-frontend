import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';

function vrenderIndividualProvider(provider) {
  return h('section#main', {
    style: {'display': ''}
  }, [ h('div.container',
        h('div.row', [
          h('div.col-sm-3', [
            h('a.thumbnail', [
              h('img', {"src": provider.lastMinuteInfo.imageUrl})
            ]),
          ]),
          h('div.col-sm-9', [
            h('h3', provider.lastMinuteInfo.customerName),
            h('div', provider.lastMinuteInfo.district)
          ]),
      ])
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
      return h('list-slot', {slot: todoData});
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


function vrenderMainSection({slots: slots, route: route}) {
  switch(route) {
    case '/': return vrenderSlotList(slots);
    case '/slot_id': return vrenderSlotList(slots);
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
