var entregaURL = global_settings.urlCORS + 'api/entrega/';


registrationModule.factory('entregaRepository', function($http) {
    return {
        refacciones: function(descripcion, par_idenpara, par_tipopara, idEmpresa, idSucursal) {
            return $http({
                url: entregaURL + 'refacciones/',
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
        }
    };
});