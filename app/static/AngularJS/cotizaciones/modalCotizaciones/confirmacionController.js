registrationModule.controller('confirmacionController', function($scope, $rootScope, $location, $timeout, alertFactory, confirmacionRepository, filterFactory, userFactory, globalFactory, datosBusqueda, plantillaRepository, cotizacionesRepository, direccionRepository) {


    $rootScope.initConfirmacion = function() {
        $scope.spinner = true;
        $scope.spinner = true;
        $scope.idPedidoBP = 0;

        $scope.msgEntregaBackorder = '';
        $scope.msgAvisoBackorder = '';
        $scope.msgTiempoEntrega = '';


        $scope.totalExistencia = -1;
        if ($scope.folioActual != "TEMP") {
            Cotizacion.get({
                id: $scope.folioActual
            }, function(data) {
                $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual = data.data;
                setTimeout(function() {
                    $scope.$parent.$parent.guardarModal = false;
                    $scope.guardar = false;
                    $scope.spinner = $scope.spinner2 = false;
                    $scope.$apply()
                }, 10)

            })
        }
    };
});