import {Rx} from '@cycle/core';
import {h} from '@cycle/web';

function serviceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.service-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({service: service}) => {
    return h('li.list-group-item.container', [
        h('div.col-sm-9', [
          h('h3', service.name),
          h('div', service.description)
        ])
    ]);
  });

  return {
    DOM: vtree$,
    events: {
      clickCustom: intent.click$.withLatestFrom(props$, (ev, {service: service}) => service),
    }
  };
}

module.exports = serviceItemComponent;
