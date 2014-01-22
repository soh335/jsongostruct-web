angular.module('JsonGoStruct', [])
    .controller('FormCtrl', function($scope, $http) {
        $scope.form = {};
        $scope.form.json = JSON.stringify(
            {
                "hoge": "fuga"
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
