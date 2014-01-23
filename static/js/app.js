angular.module('JsonGoStruct', [])
    .controller('FormCtrl', function($scope, $http) {
        $scope.form = {};
        $scope.form.name = "Sample";
        $scope.form.json = JSON.stringify(
            {
                "url": "http://example.com",
                "id": 12345,
                "name": "web",
                "bool": true,
                "array": [
                    "foo",
                    "bar"
                ],
                "map": {
                    "foo": "bar",
                    "dameleon": "dame"
                }
            },
            null,
            "    "
        );
        $scope.generate = function(form) {
            form.alert = "";
            var data;
            try {
                data = { "name": form.name || "XXX" , "json": JSON.parse(form.json) };
            }
            catch (e) {
                $scope.form.alert = "parse error";
            };
            if ( data ) {
                $http.post('/', data).
                    success(function(data, status, headers, config) {
                        $scope.form.struct = data
                    }).
                    error(function(data, status, headers, config) {
                        $scope.form.alert = data
                    })
                    ;
            }
        };
    })
    ;
