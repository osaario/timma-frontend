import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

function serviceItemComponent(drivers) {
  let intent = {
    click$: drivers.DOM.get('.service-item', 'click'),
  };

  let props$ = drivers.props.getAll().shareReplay(1);

  let vtree$ = props$.map(({service: service}) => {
    return h('li.list-group-item.container', [
        h('div.col-sm-9', [
          h('h2', service.name),
          h('h3', service.count + " palveluntarjoajaa alueella"),
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
