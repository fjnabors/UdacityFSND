var prevLocation = null;

function ViewModel() {
  const self = this;
  this.filter = ko.observable("");
  this.locationList = ko.observableArray([]);

  // Foursquare API settings
  clientID = "CQXB3L2ZFK2E52TKHDZ3SZK2YW2FBCLT145NIA23YX5FK3OV";
  clientSecret = "1MANR0Z4WXINN4T1AZGGNWF3IDZ3UAWU44AMR1LYGS5JE2AD";

  //initialize google maps
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    styles: styles,
    center: {
      lat: 35.0285018,
      lng: -89.84539079999999
    }
  });

  locations.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });

  locations.forEach(function(location) {
    self.locationList.push(new Location(location));
  });

  this.filteredLocations = ko.computed(function() {
    var searchString = self.filter().toLowerCase();
    if (searchString) {
      return ko.utils.arrayFilter(self.locationList(), function(
        location) {
        var name = location.title.toLowerCase();
        var isShown = (name.search(searchString) >= 0);
        location.visible(isShown);
        return isShown;
      });
    } else {
      self.locationList().forEach(function(location) {
        location.visible(true);
      });
      return self.locationList();
    }
  }, self);
}

//location object contains all marker and infowindow data with connection to list
var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.position = data.position;
  this.menu = "";
  this.category = "";
  this.street = "";
  this.city = "";
  this.phone = "";
  this.visible = ko.observable(true);
  this.infowindow = new google.maps.InfoWindow();

  this.marker = new google.maps.Marker({
    title: this.title,
    position: this.position,
    map: map
  });

  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' +
    this.position.lat + ',' + this.position.lng + '&client_id=' + clientID +
    '&client_secret=' +
    clientSecret + '&v=20180216' + '&query=' + this.title;

  $.getJSON(foursquareURL).done(function(data) {
    var response = data.response.venues[0];
    console.log(response);
    self.menu = response.menu.url && response.menu.url || "";
    self.category = response.categories[0].name && response.categories[0]
      .name ||
      ""
    self.street = response.location.formattedAddress[0] && response.location
      .formattedAddress[0] || "";
    self.city = response.location.formattedAddress[1] && response.location
      .formattedAddress[1] || "";
    self.phone = response.contact.formattedPhone && response.contact.formattedPhone ||
      "";
  }).fail(function() {
    alert(
      "Foursquare API call error. Please refresh the page and try again."
    );
  });


  this.hide = ko.computed(function() {
    if (this.visible() === false) {
      this.marker.setMap(null);
    } else {
      this.marker.setMap(map);
    }
    return;
  }, this);

  this.marker.addListener('click', function() {
    populateInfoWindow(self);
    if (prevLocation){
      prevLocation.infowindow.close()
      prevLocation.marker.setAnimation(null);
    }
    prevLocation = self;
  });

  this.populate = function(restaurants) {
    google.maps.event.trigger(self.marker, 'click');
  };
};

function populateInfoWindow(location) {
  innerHTML =
    '<strong><b>' + location.title + '</b></strong>' +
    '<div><em>' + location.category + '</div></em>' +
    '<div>' + location.street + '</div>' +
    '<div>' + location.city + '</div>' +
    '<div><a href="tel:' + location.phone + '">' + location.phone +
    '</a></div>' +
    '<div class="content"><a href="' + location.menu + '">View Menu</a>';


  location.infowindow.setContent(innerHTML);

  location.marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {location.marker.setAnimation(null);
  }, 2100);

  location.infowindow.addListener('closeclick', function() {
      location.marker.setAnimation(null);
  });
  // Open the infowindow on the correct marker.
  location.infowindow.open(map, location.marker);
}

function startApp() {
  ko.applyBindings(new ViewModel());
}

function mapError() {
  alert(
    "Google Maps call error. Please refresh the page and try again."
  );
}
