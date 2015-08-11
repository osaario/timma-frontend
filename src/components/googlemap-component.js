import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import TimmaMap from '../widgets/googlemap-widget'

function googleMapComponent(drivers) {
  let props$ = drivers.props.getAll().shareReplay(1);


  let vtree$ = props$.map(({markers: markers, setBounds: setBounds}) => {
    return new TimmaMap(markers, setBounds);
  });

  return {
    DOM: vtree$,
  };
}

module.exports = googleMapComponent;
