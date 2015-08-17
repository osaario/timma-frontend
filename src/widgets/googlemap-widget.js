class TimmaMap {
  constructor(markers) {
    this.type = 'Widget';
    this.markers = markers.map(x => new google.maps.LatLng(x.lastMinuteInfo.lat, x.lastMinuteInfo.lon));
    this.markersRendered = false;
  }

  init() {
    let element = document.createElement('div');
    element.id = 'timma-map';

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
      var event = new CustomEvent('bounds_changed', {'detail': {bounds: map.getBounds(), zoomLevel: map.getZoom(), center: map.getCenter()}});
      element.dispatchEvent(event);
    });
    var event = new CustomEvent('bounds_changed', {'detail': {bounds: map.getBounds(), zoomLevel: map.getZoom(), center: map.getCenter()}});
    element.dispatchEvent(event);
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
    this.update(null, element);
    return element;
  }

  update(previous, domNode) {
    //Epic diffing function for now since we only render markers once atm
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
