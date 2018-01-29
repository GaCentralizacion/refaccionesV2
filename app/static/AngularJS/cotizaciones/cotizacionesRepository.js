var cotizacionesURL = global_settings.urlCORS + 'api/cotizaciones/';


registrationModule.factory('cotizacionesRepository', function($http) {
    return {
        getCotizaciones: function(idUsuario, idEmpresa, idSucursal) {
            return $http({
                url: cotizacionesURL + 'index/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});