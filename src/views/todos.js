import {Rx} from '@cycle/core';
import {h} from '@cycle/web';
import {propHook} from '../utils';

function vrenderSlotList(slots) {
  return h('section#main', {
    style: {'display': ''}
  }, [ h('ul.list-group',
    _.chain(slots)
    .groupBy(x => x.customerId)
    .map(todoData =>
      h('li.list-group-item.container', [
        h('div.row', [
          h('div.col-sm-3', [
            h('a.thumbnail', [
              h('img', {"src": todoData[0].lastMinuteInfo.imageUrl})
            ]),
          ]),
          h('div.col-sm-9', [
            h('h3', todoData[0].lastMinuteInfo.customerName),
            h('div', todoData[0].lastMinuteInfo.district)
          ]),
        ])
      ])
    ).value()
    )
  ]);
}
function vrenderMapSection({slots: slots}) {
  return h('main-map', {markers:
      slots.map((x) =>  {
        return new google.maps.LatLng(x.lastMinuteInfo.lat, x.lastMinuteInfo.lon);
      })
    });
}


function vrenderMainSection({slots: slots, route: route}) {
  return vrenderSlotList(slots);
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
