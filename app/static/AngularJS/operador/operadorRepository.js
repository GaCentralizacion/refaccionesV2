var operadorURL = global_settings.urlCORS + 'api/operador/';


registrationModule.factory('operadorRepository', function ($http) {
    return {
    	  postCreate: function(operador) {
            return $http({
                url: operadorURL + 'create/',
                method: "POST",
                data: operador,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOperadores: function(idEmpresa) {
            return $http({
                url: operadorURL + 'operadoresShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         postUpdate: function(operador) {
            return $http({
                url: operadorURL + 'update/',
                method: "POST",
                data: operador,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
      
       
    };
});