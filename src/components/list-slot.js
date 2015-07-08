import {Rx} from '@cycle/core';
import {h} from '@cycle/web';

function listSlotComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.list-slot-clickable', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({slot: slot}) => {
    return h('li.list-group-item.container', [
      h('div.row', [
        h('div.col-sm-3', [
          h('a.thumbnail.list-slot-clickable', [
            h('img', {"src": slot[0].lastMinuteInfo.imageUrl})
          ]),
        ]),
        h('div.col-sm-9', [
          h('h3', slot[0].lastMinuteInfo.customerName),
          h('div', slot[0].lastMinuteInfo.district)
        ]),
      ])
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {slot: slot}) => slot[0]),
    }
  };
}

module.exports = listSlotComponent;
