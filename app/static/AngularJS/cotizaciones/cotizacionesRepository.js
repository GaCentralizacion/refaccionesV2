var cotizacionesURL = global_settings.urlCORS + 'api/cotizaciones/';


registrationModule.factory('cotizacionesRepository', function($http) {
    return {
        getUnidadesIngresadas: function(idEmpresa, idSucursal) {
            return $http({
                url: cotizacionesURL + 'unidadesIngresadas/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertNotificacion: function(notificacion) {
            return $http({
                url: cotizacionesURL + 'insertNotificacion/',
                method: "GET",
                params: notificacion[0],
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});