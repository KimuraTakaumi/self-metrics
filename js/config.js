var main = require("remote").require("./main");

var app = angular.module('Config', []);
app.controller('ConfigController', ['$scope', function ($scope) {
    $scope.user = '';
    $scope.url = '';
    $scope.name = '';
    $scope.init = function () {
        var config = main.getConfigData();
        console.log(config);
        $scope.user = config.user;
        $scope.url = config.url;
        $scope.name = config.name;
        $scope.$apply();
    };

    $scope.onclick = function () {
        console.log('onclick');
        var json = {};
        json['user'] = $scope.user;
        json['url'] = $scope.url;
        json['name'] = $scope.name;
        main.setConfigData(json);
    };
}]);