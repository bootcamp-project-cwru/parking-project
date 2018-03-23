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

    runcrimedata();

    var firstparturl = "https://maps.googleapis.com/maps/api/geocode/json?address="
    var apikey = "&key=AIzaSyBjGILdIXQ8XuCI_8-zYM1phGE-34kJP-k"
    var queryURL = firstparturl + streetnumber + "+" + name + "+," + city + ",+" + abbrevstate + apikey;
    console.log(queryURL);

    // var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBjGILdIXQ8XuCI_8-zYM1phGE-34kJP-k"
    
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(result) {
        console.log(result.results["0"].geometry.location.lat)
        console.log(result.results["0"].geometry.location.lng)
        latitude = result.results["0"].geometry.location.lat;
        longitude = result.results["0"].geometry.location.lng;
        runparkwhiz();
        });

        function runparkwhiz () {
        var query2firstpart = "https://api.parkwhiz.com/v4/quotes/?q=coordinates:"
        var query2secondpart = "&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00"
        var query2apikey = "&api_key=62d882d8cfe5680004fa849286b6ce20"
        var queryURL2 = query2firstpart + latitude + "," + longitude + query2secondpart + query2apikey;

        // https://api.parkwhiz.com/v4/quotes/?q=coordinates:41.8857256,-87.6369590&start_time=2017-12-23T12:00&end_time=2017-12-23T20:00&api_key=62d882d8cfe5680004fa849286b6ce20

        console.log(queryURL2);
        $.ajax({
        url: queryURL2,
        method: 'GET'
        }).then(function(result) {
        console.log(result);
        });
        }

        function runcrimedata () {
        var queryFirstURL = "https://api.usa.gov/crime/fbi/ucr/estimates/states/"+ abbrevstate + "?page=1&per_page=50&output=json&api_key=iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";
            $.ajax({
            url: queryFirstURL,
            method: "GET"
        })
            .then(function (response) {
                var results = response.results;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].year == 2016) {
                    console.log("year:", results[i].year, "number of car thefts:", results[i].motor_vehicle_theft,);
                    }
                }
            })
        }

    }

    $(".inputData").val("")

});





