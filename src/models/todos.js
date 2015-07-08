import {Rx} from '@cycle/core';

function model(intent, source) {
  return Rx.Observable.combineLatest(intent.mapBoundsChanged$, source, (bounds, slots) => {

    if(bounds != null) {
      return _.filter(slots, slot => bounds.detail.contains(new google.maps.LatLng(slot.lastMinuteInfo.lat, slot.lastMinuteInfo.lon)));
    }
    return slots;
  });

}

export default model;
