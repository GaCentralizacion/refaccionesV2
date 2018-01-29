registrationModule.controller('pedidoController', function($scope, $rootScope, $location, $timeout, alertFactory, pedidoRepository, filterFactory, userFactory, globalFactory) {
    
    $scope.fechaInicio = null;
    $scope.fechaFin = null;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
          $('#tblPedidoFiltros').DataTable().destroy();
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

    $scope.consultaPedidos=function(){

        $('#tblPedidoFiltros').DataTable().destroy();
    pedidoRepository.busquedaPedido($scope.empresas[0].emp_idempresa,$scope.sucursal,$scope.fechaInicio,$scope.fechaFin).then(function(result) {
        if (result.data.length > 0) {
            alertFactory.info('Si se  encontraron Resultados');
            $scope.listaPedidos=result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblPedidoFiltros');
                        $("#tblPedidoFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblPedidoFiltros_filter").removeClass("dataTables_info").addClass("pull-left");
                    }, 100);
        } else {
                alertFactory.info('No se encontraron Resultados');
            }
           
         });
    };



});