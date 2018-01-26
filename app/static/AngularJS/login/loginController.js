registrationModule.controller('loginController', function($scope, $rootScope, $location, loginRepository, localStorageService, userFactory, alertFactory) {

    //*******************************Variables*******************************
    $scope.userData = {};
    //**************************Init del controller**************************
    $scope.init = function() {
        $rootScope.mostrarMenu = 0;
        $scope.userData = userFactory.getUserData();
        if ($rootScope.userData == null || $rootScope.userData == undefined) {
            if (!($('#lgnUser').val().indexOf('[') > -1)) {
                var user = $('#lgnUser').val();
                $rootScope.userData = userFactory.getUsuario(user);
                $rootScope.mostrarMenu = 1;
            } else if (($('#lgnUser').val().indexOf('[') > -1) && !localStorageService.get('lgnUser')) {
                alert('Inicie sesión desde panel de aplicaciones o desde el login.');

            }
        }
    };

    // ************************* Función para logueo *************************
    $scope.iniciaSesion = function(usuario, contrasena) {
        loginRepository.getIdUsuario(usuario, contrasena).then(function(result) {
            if (result.data.length > 0) {
                //$scope.userData = userFactory.saveUserData(result.data[0]);
                $scope.idUsuario = result.data[0].idUsuarioPanel;
                console.log($scope.idUsuario)
                $rootScope.userData = userFactory.getUsuario($scope.idUsuario);
            } else {
                alertFactory.info('Valide el usuario y/o contraseña');
            }

        });
    };
});
