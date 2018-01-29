registrationModule.controller('historialController', function($scope, $rootScope, $location, $timeout, alertFactory, historialRepository, filterFactory, userFactory, globalFactory) {
    
    $scope.fechaInicio = null;
    $scope.fechaFin = null;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        
    };
    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario,'admin').then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las empresas ')
                $scope.empresas = result.data;
                filterFactory.styleFiltros();
            } else {
                alertFactory.success('No se encontraron empresas');
            }

        });
    };
    $scope.getSucursales = function() {
        $scope.muestraAgencia = false;
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresas[0].emp_idempresa, 'admin').then(function(result) {
            if (result.data.length > 0) {
                $scope.muestraAgencia = true;
                console.log(result.data, 'Soy las sucursales ')
                $scope.sucursales = result.data;
                filterFactory.styleFiltros();
            } else {
                $scope.muestraAgencia = false;
                alertFactory.success('No se encontraron empresas');
            }

        });
    };

    // $scope.consultaPedidos=function(){

    // };



});