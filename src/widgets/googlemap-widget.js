
function gmapsBoundsToTimmaBounds(gmapsBounds) {
  return  [
    gmapsBounds.getNorthEast().lat,
    gmapsBounds.getNorthEast().lng,
    gmapsBounds.getSouthWest().lat,
    gmapsBounds.getSouthWest().lng
  ];
}

function timmaBoundsToGmapsBounds(timmaBounds) {
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(timmaBounds[0], timmaBounds[1]),
    new google.maps.LatLng(timmaBounds[2], timmaBounds[3])
  );

}

class TimmaMap {
  constructor(markers, bounds) {
    this.type = 'Widget';
    let isClient = typeof window !== 'undefined' ? true : false;
    if(isClient) {
      this.markers = markers.map(x => new google.maps.LatLng(x.lastMinuteInfo.lat, x.lastMinuteInfo.lon));
      this.markersRendered = false;
    } else {
      this.markers = null;
      this.markersRendered = false;
    }
    this.bounds = bounds;
  }

  init() {
    let element = document.createElement('div');
    element.id = 'timma-map';

    let isClient = typeof window !== 'undefined' ? true : false;
    if(isClient)  {
      let mapOptions = {
        zoom: 14,
        scrollwheel: true,
        center: new google.maps.LatLng(
          60.1543,
          24.9341
        ),
        draggable: true,
      };

      let map = new google.maps.Map(element, mapOptions);

      element.officesMap = {
        map
      };

      google.maps.event.addListener(map, 'bounds_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        var event = new CustomEvent('bounds_changed', {'detail': {bounds: gmapsBoundsToTimmaBounds(map.getBounds())}});
        element.dispatchEvent(event);
      });
    }
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    this.update(null, element);
    return element;
  }

  update(previous, domNode) {
    //Epic diffing function for now since we only render markers once atm
    let isClient = typeof window !== 'undefined' ? true : false;
    if(!isClient) return;
    if(this.bounds !== null && !timmaBoundsToGmapsBounds(this.bounds).equals(domNode.officesMap.map.getBounds())) {
      domNode.officesMap.map.panToBounds(timmaBoundsToGmapsBounds(this.bounds));
      this.bounds = null;
    }

    if(this.markersRendered === true) return;
    this.markers.forEach((m) => {
      var _ = new google.maps.Marker({
        position: m,
        map: domNode.officesMap.map,
        title: "",
        zIndex: 0
      });
    });
    /*
    if(this.bounds !== null && this.bounds !== domNode.officesMap.map.getBounds()) {
        domNode.officesMap.map.fitBounds(this.bounds);
        this.bounds = null;
    }
    */

    if(this.markers.length > 0) this.markersRendered = true;
    // Let's be optimistic: ceil()

    // How much we have traveled already
    return null;
  }

  destroy(domNode) { }
}

module.exports = TimmaMap;
