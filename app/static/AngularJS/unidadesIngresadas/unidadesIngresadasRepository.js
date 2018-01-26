var unidadesIngresadasURL = global_settings.urlCORS + 'api/unidadesIngresadas/';


registrationModule.factory('unidadesIngresadasRepository', function($http) {
    return {
        getUnidadesIngresadas: function(idEmpresa, idSucursal) {
            return $http({
                url: unidadesIngresadasURL + 'unidadesIngresadas/',
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
                url: unidadesIngresadasURL + 'insertNotificacion/',
                method: "GET",
                params: notificacion[0],
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});