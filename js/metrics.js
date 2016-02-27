var main = require("remote").require("./main");

angular.module('MetricsApp', [])
    .controller('MetricsController', ['$scope', '$http', function ($scope, $http) {
        $scope.report = [];
        $scope.comment = '';
        $scope.show = false;
        $scope.subject = '';
        $scope.text = '';
        $scope.from = '';
        $scope.to = '';
        $scope.work = [];

        var $uri = 'config.json';

        $scope.init = function () {
            var config = main.getConfigData();
            console.log(config);

            var request_day = new Date();
            var request_url = 'http://' + config.url + '/metrics/' + config.user + '/' + request_day.getFullYear() + '/' + (request_day.getMonth() + 1) + '/' + request_day.getDate();
            console.log(request_url);
            $http({
                method: 'GET',
                url: request_url
            }).success(function (data, status, headers, config) {
                console.log(status);
                console.log(data);
                $scope.report = [];
                $scope.work = [];
                for (var i = 0; i < data.length; i++) {
                    var json = {};
                    json['number'] = i;
                    json['work'] = data[i].work;
                    json['time'] = '';
                    $scope.work[i] = new Date();
                    $scope.work[i].setTime(data[i].date);
                    console.log($scope.work[i].getTime());
                    $scope.report.push(json);
                }
                var json = {};
                json['number'] = data.length;
                json['work'] = '日報';
                json['time'] = '';
                $scope.work[i] = new Date();
                console.log($scope.work[i].getTime());
                $scope.report.push(json);

                for (i = 0; i < data.length; i++) {
                    var time = $scope.work[i + 1] - $scope.work[i];
                    var minutes = Math.round((time / (1000 * 60)) % 60)
                    var hours = Math.round((time / (1000 * 60 * 60)) / 24);
                    $scope.report[i]['time'] = hours + "H " + minutes + "M";
                }

            }).error(function (data, status, headers, config) {
                console.log(status);
            });

        };

        var createMailMessage = function () {
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
            var text = "各位、\n\nお疲れ様です。\n" + config.name + "です。\n\n日報を送ります。\n\n【今日の一言】\n" + $scope.comment + "\n\n【出退勤】\n出勤：" + $scope.work[0] + "\n退勤：" + $scope.work[$scope.work.length - 1]
                + "\n\n【作業項目】\n" + r + "\n\n以上、よろしくお願いいたします。";

            console.log(subject);
            console.log(to);
            console.log(from);
            console.log(text);
            $scope.subject = subject;
            $scope.text = text;
            $scope.from = subject;
            $scope.to = to;
        };

        $scope.onclick = function () {
            console.log('onclick');
            console.log($scope.comment);
            createMailMessage();
            main.sendMail($scope.subject, $scope.to, $scope.from, $scope.text);
        };

        $scope.onshow = function () {
            createMailMessage();
            $scope.show = true;
        };

        $scope.oncopy = function () {
            main.writeClipboard($scope.text);
        };
    }]);
