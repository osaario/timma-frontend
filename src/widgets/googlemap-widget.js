import Immutable from 'immutable';

class TimmaMap {
  constructor(markers) {
    this.type = 'Widget';
    this.markers = markers;
    this.markersRendered = false;
  }

  init() {
    let element = document.createElement('div');
    element.style.height = '500px';
    element.style.width = '100%';

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

    this.update(null, element);
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
    if(this.markers.length > 0) this.markersRendered = true;
    // Let's be optimistic: ceil()

    // How much we have traveled already
  }

  destroy(domNode) { }
}

module.exports = TimmaMap;
