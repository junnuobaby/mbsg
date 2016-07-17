var app = angular.module('app', []);

app.controller('indexCtrl', function ($scope, $http) {

    $scope.previous = function () {
        var cur_id = $scope.letter.id;
        $http.get('/previous/'+cur_id).success(function (response) {
            $scope.letter = {
                title: response.title,
                content: response.content,
                date: $scope.format(response.date),
                id: response._id
            };
        });
    };

    $scope.next = function () {
        var cur_id = $scope.letter.id;
        $http.get('/next/'+cur_id).success(function (response) {
            $scope.letter = {
                title: response.title,
                content: response.content,
                date: $scope.format(response.date),
                id: response._id
            };
        });
    };

    $scope.overlay_show = false;
    $scope.write_paper_show = false;
    $scope.toggle = function () {
        $scope.overlay_show = !$scope.overlay_show;
        $scope.write_paper_show = !$scope.write_paper_show;
    };

    $scope.format = function (origin_date) {
        if(!origin_date) {
            return '';
        }
        var date = new Date(origin_date);
        return date.getFullYear() + '/' + date.getMonth() + '/'
            + date.getDate() + ' '+ date.getHours() + ':' +date.getMinutes()
            + ':' + date.getSeconds();
    };
});
