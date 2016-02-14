angular.module('MetricsApp', [])
    .controller('MetricsController', ['$scope', '$http',  function($scope, $http) {
        $scope.report = [
            {number:1, work:'settings', time:'2H'},
            {number:2, work:'settings', time:'2H'},
            {number:3, work:'settings', time:'2H'},
            {number:4, work:'settings', time:'2H'}];

        var $uri ='config.json';

        $scope.init = function() {
            $http({
                method : 'GET',
                url : 'http://localhost:3000/metrics/tkimura/2016/2/14'
            }).success(function(data, status, headers, config) {
                console.log(status);
                console.log(data);
                $scope.report = [];
                var work = [];
                for(i = 0; i< data.length; i++){
                  var json = {};
                  json['number'] = i;
                  json['work'] = data[i].work;
                  json['time'] = '';
                  work[i] = new Date(data[i].date);
                  console.log(work[i].getTime());
                  $scope.report.push(json);
                }

                for(i = 0; i< data.length - 1; i++){
                  var time = work[i + 1] - work[i];
                  var minutes = Math.round((time/(1000*60))%60)
                  var hours = Math.round((time/(1000*60*60))/24);
                  $scope.report[i]['time'] = hours + "H " + minutes + "M";
                }

            }).error(function(data, status, headers, config) {
                console.log(status);
            });
        };
    }]);
