import Immutable from 'immutable';

class OfficesMap {
  constructor(percentage) {
    this.type = 'Widget';
    this.percentage = percentage;
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
    // Let's be optimistic: ceil()

    // How much we have traveled already
  }

  destroy(domNode) { }
}

module.exports = OfficesMap;
