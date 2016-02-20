var main = require("remote").require("./main");

angular.module('MetricsApp', [])
    .controller('MetricsController', ['$scope', '$http', function ($scope, $http) {
        $scope.report = [];
        $scope.comment = '';
        var $uri = 'config.json';

        $scope.init = function () {
            var config = main.getConfigData();
            console.log(config);

            var request_day = new Date();
            var request_url = config.url + '/' + config.user + '/' + request_day.getFullYear() + '/' + (request_day.getMonth() + 1) + '/' + request_day.getDate();
            console.log(request_url);
            $http({
                method: 'GET',
                url: request_url
            }).success(function (data, status, headers, config) {
                console.log(status);
                console.log(data);
                $scope.report = [];
                var work = [];
                for (var i = 0; i < data.length; i++) {
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

                for (i = 0; i < data.length; i++) {
                    var time = work[i + 1] - work[i];
                    var minutes = Math.round((time / (1000 * 60)) % 60)
                    var hours = Math.round((time / (1000 * 60 * 60)) / 24);
                    $scope.report[i]['time'] = hours + "H " + minutes + "M";
                }

            }).error(function (data, status, headers, config) {
                console.log(status);
            });

        };

        $scope.onclick = function () {
            console.log('onclick');
            console.log($scope.comment);
            var config = main.getConfigData();
            console.log(config);
            var date = new Date;

            var subject = '【日報】' + config.name + " " + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            var to = config.to;
            var from = config.from;
            var r = "";
            for (var i = 0; i < $scope.report.length - 1; i++) {
                var json = $scope.report[i];
                r += json.work + " : " + json.time + "\n";
            }
            var text = "各位、\n\nお疲れ様です。\n" + config.name + "です。\n\n日報を送ります。\n\n【今日の一言】\n" + $scope.comment + "\n\n【作業項目】\n" + r + "\n\n以上、よろしくお願いいたします。";

            console.log(subject);
            console.log(to);
            console.log(from);
            console.log(text);
            main.sendMail(subject, to, from, text);
        };
    }]);
