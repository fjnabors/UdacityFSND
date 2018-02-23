var map, clientID, clientSecret;

function AppViewModel() {
  var self = this;
  this.locationList = ko.observableArray([]);
  this.searchTerm = ko.observable("");
  this.markers = [];


  this.populateInfoWindow = function(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      // Foursquare API settings
      clientID = "CQXB3L2ZFK2E52TKHDZ3SZK2YW2FBCLT145NIA23YX5FK3OV";
      clientSecret = "1MANR0Z4WXINN4T1AZGGNWF3IDZ3UAWU44AMR1LYGS5JE2AD";
      // Foursquare URL request
      var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
        this.lat + ',' + this.lng + '&client_id=' + clientID +
        '&client_secret=' +
        clientSecret + '&v=20180220' + '&query=' + this.title;

      $.getJSON(foursquareURL).done(function(data) {
        var response = data.response.venues[0];
        console.log(response);
        self.URL = response.url && response.url || "";
        self.category = response.categories[0].name && response.categories[
            0]
          .name ||
          ""
        self.street = response.location.formattedAddress[0] && response.location
          .formattedAddress[0] || "";
        self.city = response.location.formattedAddress[1] && response.location
          .formattedAddress[1] || "";
        self.phone = response.contact.phone && formatPhone(response.contact
            .phone) ||
          "";
      }).fail(function() {
        alert(
          "Foursquare API call error. Please refresh the page and try again."
        );
      });

      this.innerHTML =
        '<strong><b>' + self.title + '</b></strong>' +
        '<div><em>( ' + self.category + ' )</div></em>' +
        '<div>' + self.street + '</div>' +
        '<div>' + self.city + '</div>' +
        '<div><a href="tel:' + self.phone + '">' + self.phone +
        '</a></div>' +
        '<div class="content"><a href="' + self.URL + '">' + self.URL +
        '</a>';

      infowindow.setContent(this.innerHTML);

      infowindow.open(map, marker);

      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  };

  //helper function to bounce marker after population
  this.bouncePopulate = function() {
    self.populateInfoWindow(this, self.largeInfoWindow);
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout((function() {
      this.setAnimation(null);
    }).bind(this), 2100);
  };

  this.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {
        lat: 35.0285018,
        lng: -89.84539079999999
      }
    });
    // Set InfoWindow
    this.largeInfoWindow = new google.maps.InfoWindow();
    for (var i = 0; i < locations.length; i++) {
      self.locationList.push(locations[i]);
      this.title = locations[i].title;
      this.lat = locations[i].lat;
      this.lng = locations[i].lng;
      // Google Maps marker setup
      this.marker = new google.maps.Marker({
        map: map,
        position: {
          lat: this.lat,
          lng: this.lng
        },
        title: this.title,
        lat: this.lat,
        lng: this.lng,
        animation: google.maps.Animation.DROP
      });
      this.marker.setMap(map);
      this.markers.push(this.marker);
      this.marker.addListener('click', self.bouncePopulate);
    }
  };
  this.initMap();

  // This block appends our locations to a list using data-bind
  // It also serves to make the filter work
  this.filteredList = ko.computed(function() {
    var result = [];
    for (var i = 0; i < this.markers.length; i++) {
      var markerLocation = this.markers[i];
      if (markerLocation.title.toLowerCase().includes(this.searchTerm()
          .toLowerCase())) {
        result.push(markerLocation);
        this.markers[i].setVisible(true);
      } else {
        this.markers[i].setVisible(false);
      }
    }
    return result;
  }, this);
}

function formatPhone(phonenum) {
  var regexObj =
    /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (regexObj.test(phonenum)) {
    var parts = phonenum.match(regexObj);
    var phone = "";
    if (parts[1]) {
      phone += "+1 (" + parts[1] + ") ";
    }
    phone += parts[2] + "-" + parts[3];
    return phone;
  } else {
    //invalid phone number
    return phonenum;
  }
}

googleError = function googleError() {
  alert(
    'Oops. Google Maps did not load. Please refresh the page and try again!'
  );
};

function startApp() {
  ko.applyBindings(new AppViewModel());
}