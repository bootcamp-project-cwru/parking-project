//allows the materialized select and modals function
$(document).ready(function () {
  $('select').material_select();
  $('.modal').modal();
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBrRQf8bBlL55nJKZANwDrPWbjm79mJ2fo",
  authDomain: "user-admission.firebaseapp.com",
  databaseURL: "https://user-admission.firebaseio.com",
  projectId: "user-admission",
  storageBucket: "user-admission.appspot.com",
  messagingSenderId: "683148603164"
};
firebase.initializeApp(config);

var database = firebase.database();

var streetnumber;
var name;
var city;
var abbrevstate;
var latitude;
var longitude;


$("#submit").on("click", function (event) {

  event.preventDefault();

  $("tbody").empty();

  //resets input box back to their default css if the form is submited.
  $(".inputData").css({
    "background-color": "#ffffff",
    "color": "#000000"
  });


  var streetnumber = $("#streetnumber").val().trim();
  //console.log(streetnumber);
  var name = $("#nameofstreet").val().trim();
  //console.log(name)
  var city = $("#city").val().trim();
  //console.log(city)
  var abbrevstate = $("#abbreviatedstate").val().trim();
  //console.log(abbrevstate)

  // form validation...
  var runAPIs = true;

  if (streetnumber === "") {
    $("#streetnumber").css({
      "background-color": "#ef5350",
      "color": "#ffffff"
    });
  }

  if (name === "") {
    $("#nameofstreet").css({
      "background-color": "#ef5350",
      "color": "#ffffff"
    });
  }

  if (city === "") {
    $("#city").css({
      "background-color": "#ef5350",
      "color": "#ffffff"
    });
  }

  if (abbrevstate === "State") {
    $("stateinput").css({
      "background-color": "#ef5350"
    });
  }

  if (streetnumber === "" || name === "" || city === "" || abbrevstate === "State") {
    $("#modal1").modal('open');
    runAPIs = false;
  }

  // if all the fields are filled out then the initAPIs function will be called.
  if (runAPIs === true) {
    initAPIs();
  }



  // function that sends requests to our apis.
  function initAPIs() {

    var firstparturl = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var apikey = "&key=AIzaSyBjGILdIXQ8XuCI_8-zYM1phGE-34kJP-k"
    var queryURL = firstparturl + streetnumber + "+" + name + "+," + city + ",+" + abbrevstate + apikey;
    console.log(queryURL);

    // var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBjGILdIXQ8XuCI_8-zYM1phGE-34kJP-k"

    axios.get(queryURL)
      .then(function (response) {
        console.log(response.data.results[0].geometry.location.lat)
        console.log(response.data.results[0].geometry.location.lng);
        latitude = response.data.results[0].geometry.location.lat;
        longitude = response.data.results[0].geometry.location.lng;

        runparkwhiz();
      });
  }

  $(".inputData").val("")

});

function runparkwhiz() {
  var query2firstpart = "https://api.parkwhiz.com/v4/quotes/?q=coordinates:"
  var query2secondpart = "&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00"
  var query2apikey = "&api_key=62d882d8cfe5680004fa849286b6ce20"
  var queryURL2 = query2firstpart + latitude + "," + longitude + query2secondpart + query2apikey;

  // https://api.parkwhiz.com/v4/quotes/?q=coordinates:41.8857256,-87.6369590&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00&api_key=62d882d8cfe5680004fa849286b6ce20

  console.log(queryURL2);

  axios.get(queryURL2).then(function (result) {

    console.log(result);

    for (var i = 0; i < result.data.length; i++) {

      var price = "N/A"
      var available = "N/A"
      var charging = "N/A"
      var garageName = result.data[i]._embedded["pw:location"].name;

      if (garageName === undefined) {
        continue
      }

      var garageAddress = result.data[i]._embedded["pw:location"].address1;
      if (garageAddress === undefined) {
        continue
      }

      // distance = result.data[2].distance.straight_line.feet;
      if (result.data[i].purchase_options[0]) {
        price = result.data[i].purchase_options[0].price.USD;
        // if (!price) {
        //     continue
        // }

        available = result.data[i].purchase_options[0].space_availability.status;
        // if (!available) {
        //     continue
        // }
        charging = result.data[i].purchase_options[0].amenities[8].enabled;
        // if (!charging) {
        //     continue
        // }
        database.ref().push({
          garageName: garageName,
          garageAddress: garageAddress,
          available: available,
          price: price,
          charging: charging,
          dateAdded: firebase.database.ServerValue.TIMESTAMP

        })
      }

      // $("#info-table > tbody").append("<tr><td>" + garageName + "</td><td>" + garageAddress + "</td><td>" + available + "</td><td>" + price + "</td><td>" + charging + "</td></tr>");
    }
  });
}

database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  // Console.loging the last user's data
  console.log(sv.garageName);
  console.log(sv.garageAddress);
  console.log(sv.available);
  console.log(sv.price);
  console.log(sv.charging);

  // Change the HTML to reflect
  $("#info-table > tbody").append("<tr><td>" + sv.garageName + "</td><td>" + sv.garageAddress + "</td><td>" + sv.available + "</td><td>" + sv.price + "</td><td>" + sv.charging + "</td></tr>");
})