var busquedaURL = global_settings.urlCORS + 'api/busqueda/';


registrationModule.factory('busquedaRepository', function($http) {
    return {
        refacciones: function(descripcion, par_idenpara, par_tipopara, idEmpresa, idSucursal) {
            return $http({
                url: busquedaURL + 'refacciones/',
                method: "GET",
                params: {
                    descripcion: descripcion,
                    par_idenpara: par_idenpara,
                    par_tipopara: par_tipopara,
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPlantillas: function(idUsuario, idEmpresa, idSucursal) {
            return $http({
                url: busquedaURL + 'plantillas/',
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
        getInfoPlantilla: function(idPlantilla) {
            return $http({
                url: busquedaURL + 'infoPlantilla/',
                method: "GET",
                params: {
                    idPlantilla: idPlantilla
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});