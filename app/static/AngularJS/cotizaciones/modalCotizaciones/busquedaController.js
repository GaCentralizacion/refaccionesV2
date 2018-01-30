registrationModule.controller('busquedaController', function($scope, $rootScope, $location, $timeout, alertFactory, busquedaRepository, filterFactory, userFactory, globalFactory, datosBusqueda) {

    // $scope.initModal = function() {
    //     $scope.Usuario = userFactory.getUserData();
    //     $scope.getEmpresas();
    //     $scope.sucursalActual = $scope.empresaActual = null;
    //     $scope.listaCotizaciones = [];
    //     $scope.busquedaActual = [];
    //     $scope.cotizacionActual = [];
    //     $scope.listaTemplates = [];
    //     $scope.$parent.$parent.guardarModal = false
    //     $scope.guardar = false;
    //     $scope.templateActual = null;
    //     $scope.templateTemp = null;
    //     $scope.spinner = true;

    // };
    $rootScope.initModal = function() {
        console.log('logre entrar')
        busquedaRepository.getPlantillas($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
            $scope.listaTemplates = result.data;
            // if (!$stateParams.template) {
            //     $scope.templateTemp = $scope.templateActual = $scope.listaTemplates[0];
            // } else {
            //     $scope.listaTemplates.forEach(function(d, n) {
            //         if (d.idCotizacionPlantilla == $stateParams.template) {
            //             $scope.templateTemp = $scope.templateActual = $scope.listaTemplates[n]
            //         }
            //     })
            // }

            $('[data-toggle="tooltip"]').tooltip()

        });
    };
    var calcularTotal = function(cotizaciones) {
        var total = 0;
        cotizaciones.forEach(function(data) {
            total += data.PTS_PCOLISTA * data.cantidad;
        })
        return total
    };

    //Busca listado de refacciones que  coincidan con el termino de busqueda
    $scope.buscarRefaccion = function() {
        // $scope.empresaActual = datosBusqueda.empresa;
        // $scope.sucursalActual = datosBusqueda.sucursal;
        // $scope.folioActual = datosBusqueda.folio;
        if ($scope.refaccionBusqueda.length > 2) {
            busquedaRepository.refacciones($scope.refaccionBusqueda, 'GEN', 'SA', $scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
                result.data.forEach(function(d) {
                    d.cantidad = 1;
                })
                $scope.busquedaActual = result.data;
            });
        } else {
            $scope.busquedaActual = []
        }
    };
});