registrationModule.controller('aprobacionController', function($sce,$scope, $rootScope, $location, $timeout, alertFactory, aprobacionRepository, filterFactory, userFactory, globalFactory,direccionRepository) {
    
   

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
                if (localStorage.getItem('cotEmpresa') !== null) {

                    $scope.cotEmpresa = []

                    $scope.tempCotEmp = localStorage.getItem('cotEmpresa')
                    $scope.cotEmpresa.push(JSON.parse($scope.tempCotEmp))

                    setTimeout(function() {

                        $("#selEmpresas").val($scope.cotEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.cotEmpresa[0][0]; //$scope.empresas;

                        $scope.consultaSucursales();
                    }, 100);

                } //SET EMPRESA LOCALSTORAGE  END
                filterFactory.styleFiltros();
            } else {
                alertFactory.success('No se encontraron empresas');
            }

        });
    };

     $scope.cambioEmpresa = function() {
        if ($scope.empresaActual.emp_idempresa != 0) {
            $scope.cotEmpresa = []
            $scope.cotEmpresa.push({
                emp_idempresa: $scope.empresaActual.emp_idempresa,
                emp_nombre: $scope.empresaActual.emp_nombre,
                emp_nombrecto: $scope.empresaActual.emp_nombrecto
            })
            //$scope.histEmpresa.push($scope.empresaActual);
            localStorage.setItem('cotEmpresa', JSON.stringify($scope.cotEmpresa));

            $scope.consultaSucursales();

        } else {
            $scope.sucursales = $scope.sucursalActual = null;
            localStorage.removeItem('cotEmpresa')
            localStorage.removeItem('cotSucursal')
        }
    };




   

        $scope.cambioSucursal = function() {
                       

                        if ($scope.sucursalActual.AGENCIA != 0) {

                            //console.log($scope.sucursalActual)

                            $scope.cotSucursal = []

                            $scope.cotSucursal.push({
                                IDSUC: $scope.sucursalActual.IDSUC,
                                Con_LimCredito: $scope.sucursalActual.Con_LimCredito,
                                NOMBRE_AGENCIA: $scope.sucursalActual.NOMBRE_AGENCIA,
                                AGENCIA: $scope.sucursalActual.AGENCIA,
                                suc_nombrecto: $scope.sucursalActual.suc_nombrecto,
                                descuento: $scope.sucursalActual.descuento,
                                importe: $scope.sucursalActual.importe,
                                saldo: $scope.sucursalActual.saldo,
                                rfcSuc: $scope.sucursalActual.rfcSuc,
                                nombreSuc: $scope.sucursalActual.nombreSuc,
                                telSuc: $scope.sucursalActual.suc_nombrecto,
                                dirSuc: $scope.sucursalActual.dirSuc,
                                nomVendedor: $scope.sucursalActual.nomVendedor,
                                telVendedor: $scope.sucursalActual.telVendedor,
                                mailVendedor: $scope.sucursalActual.mailVendedor
                            })

                            console.log('set sucursal coti local')
                            localStorage.setItem('cotSucursal', JSON.stringify($scope.cotSucursal));
                        } else {
                            localStorage.removeItem('cotSucursal')
                        }

                        console.log('consulta ')
                        var datos = {
                            idUsuario: $scope.Usuario.idUsuario,
                            idEmpresa: $scope.empresaActual.emp_idempresa,
                            idSucursal: $scope.sucursalActual.AGENCIA,
                            opcion: 2,
                            idEstatus: 1,
                            role:'admin'
                        }
                        direccionRepository.getDirecciones(datos).then(function(result) {
                        $scope.listaDirecciones = result.data;


                            $('#tblDireccionFiltros').DataTable().destroy();

                            setTimeout(function() {
                                $scope.setTablePaging('tblDireccionFiltros');

                                $("#tblDireccionFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblDireccionFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

                            }, 1);

                      });

                        // Direccion.query({
                        //     idUsuario: $scope.user.per_idpersona,
                        //     idEmpresa: $scope.empresaActual.emp_idempresa,
                        //     idSucursal: $scope.sucursalActual.AGENCIA,
                        //     idEstatus: 1,
                        //     opcion: 2
                        // }, function(data) {

                        //     console.log('direcciones success!')
                        //     console.log(data)

                        //     $scope.listaDirecciones = data;


                        //     $('#tblDireccionFiltros').DataTable().destroy();

                        //     setTimeout(function() {
                        //         $scope.setTablePaging('tblDireccionFiltros');

                        //         $("#tblDireccionFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                        //         $("#tblDireccionFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

                        //     }, 1);

                        // })


                    }; //end cambio sucursales




         $scope.consultaSucursales = function() {
                filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, 'admin').then(function(result) {
                    if (result.data.length > 0) {
                            $scope.sucursales = result.data;
                            $scope.sucursalActual = $scope.sucursales[0];

                    }
                });

        };//end consulta sucursales



        $scope.verDetalleDireccion=function(direccion){
            console.log(direccion);


        };

         

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