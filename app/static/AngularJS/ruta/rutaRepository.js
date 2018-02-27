var rutaURL = global_settings.urlCORS + 'api/ruta/';


registrationModule.factory('rutaRepository', function ($http) {
    return {
    	  postCreate: function(ruta) {
            return $http({
                url: rutaURL + 'create/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getRutas: function(idEmpresa) {
            return $http({
                url: rutaURL + 'rutasShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         postUpdate: function(ruta) {
            return $http({
                url: rutaURL + 'update/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         getCatalogoRutas: function(idEmpresa) {
            return $http({
                url: rutaURL + 'catalogoRutas/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
      
       
    };
});