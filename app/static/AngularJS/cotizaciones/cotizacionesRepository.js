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
        },
        guardaCotizacion: function(cotizacionGuardar) {
            return $http({
                url: cotizacionesURL + 'create/',
                method: "POST",
                data: cotizacionGuardar,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});