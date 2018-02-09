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
        },
        getCotizacion: function(folioActual) {
            return $http({
                url: cotizacionesURL + 'show/',
                method: "GET",
                params: { id: folioActual },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        deleteCotizacion: function(idCotizacion) {
            return $http({
                url: cotizacionesURL + 'destroy/',
                method: "GET",
                params: { id: idCotizacion },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateCotizacion: function(cotizacion) {
            return $http({
                url: cotizacionesURL + 'update/',
                method: "POST",
                data: cotizacion,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});