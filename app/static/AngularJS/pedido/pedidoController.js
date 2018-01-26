registrationModule.controller('pedidoController', function($scope, $rootScope, $location, $timeout, alertFactory, pedidoRepository, filterFactory, userFactory, globalFactory, utils) {


    $scope.fechaInicio = null;
    $scope.fechaFin = null;
  

    $scope.init = function() {
   
     
      
    };
     $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario).then(function(result) {
            if (result.data.length > 0) {
               
                $scope.empresas = result.data;
                filterFactory.styleFiltros();
            } else {
              
            }

        });
    };
     $scope.getSucursales = function() {
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresa).then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las sucursales ')
                $scope.agencias = result.data;
                filterFactory.styleFiltros();
            } else {
                alertFactory.success('No se encontraron sucursales');
            }

        });
    };
     $scope.buscar = function() {
      
        if($scope.fechaInicio=='')
            $scope.fechaInicio=null
        if($scope.fechaFin=='')
             $scope.fechaFin=null
        
        pedidoRepository.busquedaPedido($scope.tipoMonitor,$scope.empresa,$scope.sucursal,$scope.fechaInicio,$scope.fechaFin,0,0,0).then(function(result) {
      if (result.data.length > 0) {
        alert(1);
            
        //             // setTimeout(function() {
        //             // $scope.setTablePaging('tblCtrlDepositos'+$scope.tipoMonitor);
        //             // }, 2000);
        //             // $scope.tabsClick($scope.tipoMonitor);
        } 
        //else {
        //         alertFactory.info('No se encontraron Resultados');
        //     }
           
      });
    };





 $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1 = true;
    };

    $scope.open2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened2 = true;
    };
 //DatePicker
    $scope.today = function() {
        $scope.dt1 = new Date();
        $scope.dt2 = new Date();
    };

    //$scope.today();

    $scope.clear = function() {
        $scope.dt1 = null;
        $scope.dt2 = null;
    };
$scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $rootScope.format = $scope.formats[0];


      $scope.setTablePaging = function(idTable) {
            $('#' + idTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [{
                    extend: 'excel',
                    title: 'Reporte de Errores'
                }, {
                    extend: 'print',
                    customize: function(win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                }]
            });
        };
    
});
