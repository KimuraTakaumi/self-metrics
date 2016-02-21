var main = require("remote").require("./main");

var app = angular.module('Config', []);
app.controller('ConfigController', ['$scope', function ($scope) {
    $scope.user = '';
    $scope.url = '';
    $scope.name = '';
    $scope.to = '';
    $scope.from = '';
    $scope.show = false;
    $scope.init = function () {
        var config = main.getConfigData();
        console.log(config);
        $scope.user = config.user;
        $scope.url = config.url;
        $scope.name = config.name;
        $scope.from = config.from;
        $scope.to = config.to;
        $scope.$apply();
    };

    $scope.onclick = function () {
        console.log('onclick');

        if ($scope.user == "" || $scope.url == ""
            || $scope.name == "" || $scope.from == "" || $scope.to == "") {
            $scope.show = true;
        } else {
            var json = {};
            json['user'] = $scope.user;
            json['url'] = $scope.url;
            json['name'] = $scope.name;
            json['from'] = $scope.from;
            json['to'] = $scope.to;
            main.setConfigData(json);
        }
    };
}]);