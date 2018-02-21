var loginURL = global_settings.urlCORS + 'api/login/';

registrationModule.factory('loginRepository', function($http) {
    return {
        getUsuario: function(idUsuario, rol) {
            return $http({
                url: loginURL + 'usuario/',
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
        getIdUsuario: function(usuario, contrasena) {
            return $http({
                url: loginURL + 'idUsuario/',
                method: "GET",
                params: {
                    usuario: usuario,
                    contrasena: contrasena
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }

    };

});