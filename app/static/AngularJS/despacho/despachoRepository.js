var despachoURL = global_settings.urlCORS + 'api/despacho/';


registrationModule.factory('despachoRepository', function ($http) {
    return {
          postCreate: function(ruta) {
            return $http({
                url: despachoURL + 'create/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getRutas: function(idEmpresa) {
            return $http({
                url: despachoURL + 'rutasShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         postUpdate: function(ruta) {
            return $http({
                url: despachoURL + 'update/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         getCatalogoRutas: function(idEmpresa) {
            return $http({
                url: despachoURL + 'catalogoRutas/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
      
       
    };
});