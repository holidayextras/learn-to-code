(function () {
  var API_KEY = 'b51c392c6a25dced28ff1578c5af8e4c'

  // A simple helper allowing us to navigate the DOM
  $ = function (selector) {
    return document.querySelector(selector)
  }

  // Create a generic way to call the XMLHTTPREQUEST methods
  var request;
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE
    try {
      request = new ActiveXObject('Msxml2.XMLHTTP');
    } 
    catch (e) {
      try {
        request = new ActiveXObject('Microsoft.XMLHTTP');
      } 
      catch (e) {}
    }
  }

  // Helper function to turn objects to query strings {'hello': 'world', 'foo': 'bar'} = hello=world&foo=bar
  var serializeObject = function(obj) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }


  // a helper function that will allow us to call flickrs api
  var flickrSearch = function (action, params, callback) {

    request.open('GET', 'https://api.flickr.com/services/rest/?method=' + action + '&api_key=' + API_KEY + '&' + serializeObject(params) + '&format=json&nojsoncallback=1')
    request.send(null)

    request.onreadystatechange = function() {
      if(request.readyState === 4) { // done
        if(request.status === 200) { // complete	
          return callback(null, JSON.parse(request.responseText))
        }
      }
    };
  }

  // a helper function to render a photo onto the page
  var renderPhoto = function (photo, index) {
    let even = index % 2 === 0

    if (even) {
      var markup = "<div class='row'> <div class='col-sm-6'>"
      markup += "<img class='img-responsive' src='https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg' />"
      markup += "</div>"
    }

    if (!even) {
      var markup = "<div class='col-sm-6'>"
      markup += "<img class='img-responsive' src='https://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg' />"
      markup += "</div> </div> <br>"
    }

    return markup
  }

  // When clicking on the search button
  $('#search').addEventListener('click', function (e) {
    e.preventDefault()

    // get the value that the user has typed in
    var locationQuery = $('#locationName').value
    flickrSearch('flickr.places.find', {query: locationQuery}, function (error, placeResponse) {
      var placeId = placeResponse.places.place[0].place_id
      flickrSearch('flickr.photos.search', {place_id: placeId}, function (error, photosResponse) {
        var photos = photosResponse.photos.photo.slice(0, 10)
        var markup = ""
        for(var photoKey in photos) {
          markup += renderPhoto(photos[photoKey], photoKey)
        }

        $(".photos").innerHTML = markup
      })
    })
  })
})()
