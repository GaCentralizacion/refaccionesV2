registrationModule.factory('userFactory', function(localStorageService, alertFactory, loginRepository, $rootScope) {
    return {
        getUserData: function() {
            return (localStorageService.get('userData'));
        },
        saveUserData: function(userData) {
            localStorageService.set('userData', userData);

            return (localStorageService.get('userData'));
        },
        logOut: function() {
            localStorageService.clearAll();
            location.href = '/';
        },
        ValidaSesion: function() {
            var userData = localStorageService.get('userData');

            if (userData == null || userData == undefined) {
                location.href = '/';
            }
        },
        //Para obtener la informacion del usuario en bd del panel de aplicaciones 
        getUsuario: function(idUsuario) {
            loginRepository.getUsuario(idUsuario).then(function(result) {
                if (result.data.length > 0) {
                    $rootScope.userData = result.data[0];
                    localStorageService.set('userData', $rootScope.userData);
                    $rootScope.mostrarMenu = 1;
                    location.href = '/cotizaciones';
                } else {
                    alertFactory.info('Inicie sesión desde el panel de aplicaciones o desde el login.');
                }
            });
        }
    }
});
