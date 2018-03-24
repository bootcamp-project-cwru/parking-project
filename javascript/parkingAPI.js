//allows the materialized select and modals function
$(document).ready(function() {
  $('select').material_select();
  $('.modal').modal();
});

var streetnumber;
var name;
var city;
var abbrevstate;
var latitude;
var longitude;

$("#submit").on("click", function(event) {

    event.preventDefault();

    //resets input box back to their default css if the form is submited.
    $(".inputData").css({"background-color": "#ffffff", "color": "#000000"});


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
      $("#streetnumber").css({"background-color": "#ef5350", "color": "#ffffff"});
    }

    if (name === "") {
      $("#nameofstreet").css({"background-color": "#ef5350", "color": "#ffffff"});
    }

    if (city === "") {
      $("#city").css({"background-color": "#ef5350", "color": "#ffffff"});
    }

    if (abbrevstate === "State") {
      $("stateinput").css({"background-color": "#ef5350"});
    }

    if (streetnumber === "" || name === "" || city === "" || abbrevstate === "State" ) {
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
  })
    /*$.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(result) {
        console.log(result.results["0"].geometry.location.lat)
        console.log(result.results["0"].geometry.location.lng)
        latitude = result.results["0"].geometry.location.lat;
        longitude = result.results["0"].geometry.location.lng;
        runparkwhiz();
        });*/

        function runparkwhiz () {
        var query2firstpart = "https://api.parkwhiz.com/v4/quotes/?q=coordinates:"
        var query2secondpart = "&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00"
        var query2apikey = "&api_key=62d882d8cfe5680004fa849286b6ce20"
        var queryURL2 = query2firstpart + latitude + "," + longitude + query2secondpart + query2apikey;

        // https://api.parkwhiz.com/v4/quotes/?q=coordinates:41.8857256,-87.6369590&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00&api_key=62d882d8cfe5680004fa849286b6ce20

        console.log(queryURL2);
        axios.get(queryURL2).then(function(result) {
        console.log(result);
        });
        }

    }

    $(".inputData").val("")

});