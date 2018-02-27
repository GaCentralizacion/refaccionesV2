var unidadURL = global_settings.urlCORS + 'api/unidad/';


registrationModule.factory('unidadRepository', function ($http) {
    return {
    	  postCreate: function(unidad) {
          
            return $http({
                url: unidadURL + 'create/',
                method: "POST",
                data: unidad,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getUnidades: function(idEmpresa) {
            return $http({
                url: unidadURL + 'unidadesShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         postUpdate: function(unidad) {
            return $http({
                url: unidadURL + 'update/',
                method: "POST",
                data: unidad,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
       getMarcas: function(idEmpresa) {
       
            return $http({
                url: unidadURL + 'marcas/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         getTiposUnidades: function() {

            return $http({
                url: unidadURL + 'tipoUnidades/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPesoUni: function() {

            return $http({
                url: unidadURL + 'pesoUni/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});