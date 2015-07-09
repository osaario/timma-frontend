import Immutable from 'immutable';

class TimmaMap {
  constructor(markers, {center: center, zoomLevel: zoom}) {
    this.type = 'Widget';
    this.markers = markers;
    this.markersRendered = false;
    this.zoom = zoom;
    this.center = center;
  }

  init() {
    let element = document.createElement('div');
    element.id = 'timma-map'
    element.style.height = '500px';
    element.style.width = '100%';

    let mapOptions = {
      zoom: this.zoom,
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

    this.update(null, element);


    google.maps.event.addListener(map, 'bounds_changed', function() {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      var event = new CustomEvent('bounds_changed', {'detail': {bounds: map.getBounds(), zoomLevel: map.getZoom(), center: map.getCenter()}});
      element.dispatchEvent(event);
    })
      var event = new CustomEvent('bounds_changed', {'detail': {bounds: map.getBounds(), zoomLevel: map.getZoom(), center: map.getCenter()}});
      element.dispatchEvent(event);
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
    return element;
  }

  update(previous, domNode) {
    //Epic diffing function for now since we only render markers once atm
    if(this.markersRendered == true) return;
    this.markers.forEach((m) => {
      var _ = new google.maps.Marker({
        position: m,
        map: domNode.officesMap.map,
        title: "",
        zIndex: 0
      });
    });
    if(this.zoom !== domNode.officesMap.map.getZoom()) {
        domNode.officesMap.map.setZoom(this.zoom);
    }
    if(this.center != null && this.center !== domNode.officesMap.map.getCenter()) {
        domNode.officesMap.map.setCenter(this.center);
    }

    if(this.markers.length > 0) this.markersRendered = true;
    // Let's be optimistic: ceil()

    // How much we have traveled already
  }

  destroy(domNode) { }
}

module.exports = TimmaMap;
