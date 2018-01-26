var filtrosURL = global_settings.urlCORS + 'api/filtros/';
registrationModule.factory('filterFactory', function($http, $timeout) {
    return {
        getEmpresas: function(idUsuario, rol) {
            return $http({
                url: filtrosURL + 'empresas/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    rol: rol
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getSucursales: function(idUsuario, idEmpresa) {
            return $http({
                url: filtrosURL + 'sucursales/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        styleFiltros: function() {
            $timeout(function() {
                $('.selectpicker').selectpicker('refresh', );
            });
        }
    }
});