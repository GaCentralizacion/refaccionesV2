registrationModule.controller('historialController', function($scope, $rootScope, $location, $timeout, alertFactory, historialRepository, filterFactory, userFactory, globalFactory,pedidoRepository) {
    
   

   $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
    };



            $scope.getEmpresas = function() {
                filterFactory.getEmpresas($scope.Usuario.idUsuario, 'admin').then(function(result) {           
                    if (result.data.length > 0) {
                        console.log(result.data, 'Soy las empresas ')
                        $scope.empresas = result.data;
                        $scope.empresaActual = $scope.empresas[0];

                        //SET EMPRESA LOCALSTORAGE   BEGIN
                        if (localStorage.getItem('histEmpresa') !== null) {

                        $scope.histEmpresa = []

                        $scope.tempHistEmp = localStorage.getItem('histEmpresa')
                        $scope.histEmpresa.push(JSON.parse($scope.tempHistEmp))

                        console.log('$scope.histEmpresa')
                        console.log($scope.histEmpresa[0][0])

                        setTimeout(function() {

                        $("#selEmpresas").val($scope.histEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.histEmpresa[0][0]; //$scope.empresas;

                        $scope.consultaSucursales();
                        }, 100);

                        } //SET EMPRESA LOCALSTORAGE  END

                    } else {
                        alertFactory.success('No se encontraron empresas');
                     }
                });

            }; 


    $scope.cambioEmpresa = function() {
                if ($scope.empresaActual.emp_idempresa != 0) {

                    $scope.histEmpresa = []
                    console.log('empresa actual')
                    console.log($scope.empresaActual)
                        //console.log($scope.empresaActual)

                    $scope.histEmpresa.push({
                            emp_idempresa: $scope.empresaActual.emp_idempresa,
                            emp_nombre: $scope.empresaActual.emp_nombre,
                            emp_nombrecto: $scope.empresaActual.emp_nombrecto
                        })
                        //$scope.histEmpresa.push($scope.empresaActual);
                    localStorage.setItem('histEmpresa', JSON.stringify($scope.histEmpresa));
                    //}

                    $scope.consultaSucursales();

                } else {
                    $scope.sucursales = $scope.sucursalActual = null;
                    localStorage.removeItem('histEmpresa')
                    localStorage.removeItem('histSucursal')
                }
    };

     $scope.cambioSucursal = function(empresa, sucursal, fecha , fechaFin) {

                $scope.consultaPedidos(empresa, sucursal, fecha, fechaFin);


                console.log($scope.sucursalActual)    

                if ($scope.sucursalActual.AGENCIA != 0) {

                    $scope.histSucursal = []
                    console.log('sucursal actual')
                    console.log($scope.sucursalActual)
                        //console.log($scope.empresaActual)

                    $scope.histSucursal.push({
                            AGENCIA: $scope.sucursalActual.AGENCIA,
                            NOMBRE_AGENCIA: $scope.sucursalActual.NOMBRE_AGENCIA,
                            IDSUC: $scope.sucursalActual.IDSUC,
                            suc_nombrecto: $scope.sucursalActual.suc_nombrecto
                        })
                        //$scope.histEmpresa.push($scope.empresaActual);
                        console.log('agregando sucursal actual a localStorage')
                    localStorage.setItem('histSucursal', JSON.stringify($scope.histSucursal));
                } else {
                    localStorage.removeItem('histSucursal')
                }
            };

          

            $scope.consultaSucursales = function() {
                filterFactory.getSucursales($scope.Usuario.idUsuario,$scope.empresaActual.emp_idempresa, 'admin').then(function(result) {
                        if (result.data.length > 0) {
                              $scope.sucursales = result.data;
                              $scope.sucursalActual = $scope.sucursales[0];
                                 //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                                if (localStorage.getItem('histSucursal') !== null) {

                                    $scope.histSucursal = []
                                    
                                    //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                                    $scope.tempHistSuc = localStorage.getItem('histSucursal')
                                    $scope.histSucursal.push(JSON.parse($scope.tempHistSuc))

                                    console.log('$scope.histSucursal')
                                    console.log($scope.histSucursal[0][0])

                                    setTimeout(function() {

                                        $("#selSucursales").val($scope.histSucursal[0][0].AGENCIA);
                                        $scope.sucursalActual = $scope.histSucursal[0][0]; //$scope.empresas;

                                        $scope.consultaPedidos($scope.empresaActual, $scope.sucursalActual, $scope.fecha , $scope.fechaFin);
                                        
                                    }, 100);

                                } //SET SUCURSAL DESDE LOCALSTORAGE   END
                        }
                 });
            };

            $scope.consultaPedidos = function(empresa, sucursal, fecha, fechaFin) {

                pedidoRepository.busquedaPedido($scope.Usuario.idUsuario,2, empresa.emp_idempresa,sucursal.AGENCIA,fecha,fechaFin).then(function(result) {
                     if (result.data.length > 0) { 
                             $scope.listaPedidos =result.data
                                //console.log(data)

                            $('#tblHistoricoFiltros').DataTable().destroy();

                            setTimeout(function() {
                                $scope.setTablePaging('tblHistoricoFiltros');

                                $("#tblHistoricoFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblHistoricoFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

                            }, 1);
                         }else{
                            alertFactory.historial('No se encontraron resultados'); 
                        }
                    });
                }; //fin consultaPedido



        $scope.setTablePaging = function(idTable) {
                $('#' + idTable).DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    order: [0, 'desc'],
                    buttons: [{
                        extend: 'copy'
                    }, {
                        extend: 'csv'
                    }, {
                        extend: 'excel',
                        title: 'ExampleFile'
                    }, {
                        extend: 'pdf',
                        title: 'ExampleFile'
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
            };//end setTablePaging


});