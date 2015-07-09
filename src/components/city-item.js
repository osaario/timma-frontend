import {Rx} from '@cycle/core';
import {h} from '@cycle/web';

function cityItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.city-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({city: city}) => {
    return h('li.list-group-item.container', [
        h('div.col-sm-9', [
          h('h2', city.city)
        ])
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {city: city}) => city),
    }
  };
}

module.exports = cityItemComponent;
