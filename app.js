var app = angular.module('weatherApp', []);

app.controller("WeatherController", ['$http', function($http) {

    //localStorage.setItem('bsWx.location', 'KLAX');
    //console.log(localStorage);

    var main = this;

    // set initial vars
    main.showWeather = false;
    main.showSpinner = false;
    main.locationError = false;
    main.message = "Location not found.";
    main.weather = {};

    main.searchWeather = function() {
        main.getWeather(main.searchTerm);
    };

    main.getWeather = function(location) {

        main.showWeather = false;
        main.showSpinner = true;
        main.locationError = false;

        // convert location to upper case for API use
        location = location.toUpperCase();

        $http.jsonp('http://api.wunderground.com/api/a7942b382662121a/geolookup/conditions/forecast/astronomy/q/' + location + '.json?callback=JSON_CALLBACK')
            .success(function (data) {

                main.showSpinner = false;

                console.log(data);

                if (data.response.error) {
                    if (data.response.error.type == "querynotfound") {
                        main.locationError = true;
                    }
                } else {
                    main.weather.city = data['current_observation']['observation_location']['city'];
                    main.weather.temperature = data['current_observation']['temp_f'];
                    main.weather.conditions = data['current_observation']['weather'];
                    main.weather.dewPoint = data['current_observation']['dewpoint_f'];
                    main.weather.humidity = data['current_observation']['relative_humidity'];
                    main.weather.windDirection = data['current_observation']['wind_dir'];
                    main.weather.windSpeed = data['current_observation']['wind_mph'];
                    main.weather.pressure = data['current_observation']['pressure_in'];
                    main.weather.icon = data['current_observation']['icon_url'];

                    if (data['current_observation']['pressure_trend'] == "+") main.weather.pressureTrend = "R";
                    if (data['current_observation']['pressure_trend'] == "0") main.weather.pressureTrend = "S";
                    if (data['current_observation']['pressure_trend'] == "-") main.weather.pressureTrend = "F";

                    console.group("%cForecast Data", "color:#068");
                    main.weather.forecast = [];
                    var forecast;
                    var i = 0;
                    while (i < data.forecast.simpleforecast.forecastday.length) {
                        forecast = data.forecast.simpleforecast.forecastday[i];
                        main.weather.forecast[i] = {};
                        main.weather.forecast[i].date = forecast.date.weekday + " " + forecast.date.month + "/" + forecast.date.day;
                        main.weather.forecast[i].hi = forecast.high.fahrenheit;
                        main.weather.forecast[i].lo = forecast.low.fahrenheit;
                        main.weather.forecast[i].icon = forecast.icon_url;
                        console.log(main.weather.forecast[i]);
                        i++;
                    }
                    console.groupEnd();

                    main.showWeather = true;
                }

        });

    };

}]);