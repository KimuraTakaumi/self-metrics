var main = require("remote").require("./main");

angular.module('ItemsApp', [])
    .controller('ItemsController', ['$scope',function ($scope) {
        $scope.items = '';
        $scope.show = false;

        $scope.init = function () {
            var items = main.getItemsData();
            console.log(items);

            $scope.items = JSON.stringify(items,null, "    ");
        };

        $scope.onclick = function () {
            console.log('onclick');

            try {
                var json = JSON.parse($scope.items);
                main.setItemsData(json);
            } catch (e) {
                $scope.show = true;
            }
        };
    }]);
