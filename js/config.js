var app = angular.module('Config', ['ngMaterial', 'ngMessages']);
app.controller('ConfigController', function($scope) {
        $scope.config = {
            user: '',
            url: ''
        };
        $scope.init = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'config.json', true);
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    console.log("config test2");
                    console.log(xhr.responseText);
                    var json = JSON.parse(xhr.responseText);
                    $scope.config.user = json.user;
                    $scope.config.url = json.url;
                    $scope.$apply();
                }
            };
            xhr.send(null);
        };
    })
    .config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });