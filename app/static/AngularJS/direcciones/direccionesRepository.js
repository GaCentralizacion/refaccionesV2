var direccionURL = global_settings.urlCORS + 'api/direccion/';


registrationModule.factory('direccionRepository', function($http) {
    return {
        getDirecciones: function(data) {
            return $http({
                url: direccionURL + 'index/',
                method: "GET",
                params: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});