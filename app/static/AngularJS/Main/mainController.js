registrationModule.controller('mainController', function($scope, $rootScope, $location, localStorageService, alertFactory, userFactory) {

    $scope.init = function() {
        //userFactory.ValidaSesion();
        $scope.userData = userFactory.getUserData();

        if ($scope.userData != undefined) {
            $rootScope.mostrarMenu = 1;
        }
    }

    $scope.salir = function() {
        localStorage.removeItem('histEmpresa')
        localStorage.removeItem('histSucursal')

        /*remueve las opciones de pedidos*/
        localStorage.removeItem('pedEmpresa')
        localStorage.removeItem('pedSucursal')
        /*remueve las opciones de cotizaciones*/
        localStorage.removeItem('cotEmpresa')
        localStorage.removeItem('cotSucursal')
        userFactory.logOut();
    }
});