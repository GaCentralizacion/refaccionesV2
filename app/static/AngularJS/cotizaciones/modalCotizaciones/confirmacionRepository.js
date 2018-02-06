var confirmacionURL = global_settings.urlCORS + 'api/confirmacion/';


registrationModule.factory('confirmacionRepository', function($http) {
    return {
        getDirecciones: function(data) {
            return $http({
                url: confirmacionURL + 'index/',
                method: "GET",
                params: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});