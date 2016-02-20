angular.module('MetricsApp', [])
    .controller('MetricsController', ['$scope', '$http',  function($scope, $http) {
        $scope.report = [];
        $scope.comment = '';
        var $uri ='config.json';

        $scope.init = function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/config.json', true);
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200){
                    console.log(xhr.responseText);
                    var json = JSON.parse(xhr.responseText);

                    var request_day = new Date();
                    var request_url = json.url + '/' + json.user + '/' +request_day.getFullYear()+'/' +(request_day.getMonth()+1)+'/' + request_day.getDate();
                    console.log(request_url);
                    $http({
                        method : 'GET',
                        url :request_url
                    }).success(function(data, status, headers, config) {
                        console.log(status);
                        console.log(data);
                        $scope.report = [];
                        var work = [];
                        for(var i = 0; i< data.length; i++){
                            var json = {};
                            json['number'] = i;
                            json['work'] = data[i].work;
                            json['time'] = '';
                            work[i] = new Date(data[i].date);
                            console.log(work[i].getTime());
                            $scope.report.push(json);
                        }
                        var json = {};
                        json['number'] = data.length;
                        json['work'] = '日報';
                        json['time'] = '';
                        work[i] = new Date();
                        console.log(work[i].getTime());
                        $scope.report.push(json);

                        for(i = 0; i< data.length; i++){
                            var time = work[i + 1] - work[i];
                            var minutes = Math.round((time/(1000*60))%60)
                            var hours = Math.round((time/(1000*60*60))/24);
                            $scope.report[i]['time'] = hours + "H " + minutes + "M";
                        }

                    }).error(function(data, status, headers, config) {
                        console.log(status);
                    });


                }
            };
            xhr.send(null);




        };

        $scope.onclick = function() {
            console.log('onclick');
            console.log($scope.comment);
        };
    }]);
