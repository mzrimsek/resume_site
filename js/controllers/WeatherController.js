app.controller('WeatherController', ['$scope', '$http', function($scope, $http) {
  var apiKey = '6fde0a22cc0a46f307fcd213ec2ff92c';

  $scope.currentWeather = {};
  $scope.weatherForecast = {};
  $scope.location = {};

  $scope.getWeatherData = function() {
    if ($scope.zipcode) {
      $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?zip=' + $scope.zipcode + ',US&APPID=' + apiKey + '&units=imperial'
      }).success(function(response) {
        $scope.currentWeather = response;
        //console.log($scope.currentWeather);

        $http({
          method: 'GET',
          url: 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + $scope.currentWeather.id + ',US&APPID=' + apiKey + '&cnt=8&units=imperial'
        }).success(function(response) {
          var currentDate = new Date();
          var days = new Array(response.list.length);
          for (var i = 0; i < days.length; i++) {
            days[i] = new Day(currentDate.getTime(), response.list[i]);
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
          }
          $scope.weatherForecast = days;
          //console.log($scope.weatherForecast);
        });
      });

      $http({
        method: 'GET',
        url: 'http://api.geonames.org/postalCodeSearchJSON?postalcode=' + $scope.zipcode + '&country=US&username=mzrimsek'
      }).success(function(response) {
        $scope.location = response.postalCodes[0];
        $scope.contentLoaded = true;
        //console.log($scope.location);
      });
    }
  };

  $scope.getWeatherIcon = function(weatherId){
    return 'http://openweathermap.org/img/w/'+weatherId+'.png';
  };
}]);

/**
 * Constructor for new Day object
 * @param {String} date    Representation of date of the day
 * @param {Object} reports Object containing weather data returned from API call
 */
function Day(date, report) {
  this.date = date;
  this.report = report;
}