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



     $scope.muestraComprobante = function() {

            //$scope.idDireccion
            //alert(document.pressed);

           win.loadURL('C:/GA_Centralizacion/CuentasXCobrar/Refacciones/DireccionesCliente/' +  $scope.direccion.RTD_IDPERSONA + '/' +  $scope.direccion.idDireccion + '/' + $scope.direccion.idDireccion + '_comprobante.pdf', 'Comprobante de domicilio', 'height=400,width=600');

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
                                console.log(  $scope.listaDirecciones);

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
            
            $scope.direccion=direccion;
            
            $scope.rutas =[{RUT_IDRUTA:0,RUT_NOMBRERT:"Selecciona.."},
                           {RUT_IDRUTA:1,RUT_NOMBRERT:"Ruta 1"},
                           {RUT_IDRUTA:2,RUT_NOMBRERT:"Ruta 2"}];
            $scope.rutaActual = $scope.rutas[0];



             var datoVn={
                            idUsuario:$scope.Usuario.idUsuario,
                            idDireccion: $scope.direccion.idDireccion,
                            idEmpresa: $scope.empresaActual.emp_idempresa,
                            idSucursal: $scope.sucursalActual.AGENCIA
                        }; 

            // $scope.vendedores = [{per_idpersona:0,nombre:"Selecciona.."},
            //                      {per_idpersona:1,nombre:"Pedro"},
            //                      {per_idpersona:2,nombre:"Paco"}];
              direccionRepository.getVendedor(datoVn).then(function(result) {

                      $scope.vendedores =result.data
                      $scope.vendedores.unshift({per_idpersona:0,nombre:"Selecciona.."});
                      $scope.vendedorActual = $scope.vendedores[0];
                });;

          

            $('#modalAprobacion').modal('show');
        };


         $scope.Procesar = function(operacion) {
                     

                    var operacionCadena = (operacion == 2) ? 'Aprobar' : 'Rechazar';

                    new Promise(function(resolve, reject) {

                        $scope.cadenaConfirma = "<h4>Está a punto de " + operacionCadena + " esta dirección ¿Desea continuar?</h4>"

                        bootbox.confirm($scope.cadenaConfirma,
                            function(result) {
                                if (result)
                                    resolve(operacion)
                                else
                                    reject(operacion)
                            }
                        )
                    }).then(function(operacion) {

                        new Promise(function(resolve, reject) {

                           var dire={
                            idUsuario:$scope.Usuario.idUsuario,
                            idRuta:$scope.rutaActual.RUT_IDRUTA,
                            idDireccion: $scope.direccion.idDireccion,
                            operacionP:operacion,
                            idVendedor:$scope.vendedorActual.per_idpersona
                           }; 

                          direccionRepository.postUpdate(dire);

                        }).then(function(respuesta) {

                            bootbox.alert("<h4>" + respuesta.mensaje + "</h4>",
                                function() {
                                    $('.modal-aprobacion').modal('hide')
                                        //$state.go("user.aprobacion")
                                });

                        })

                       


                    });

                }; //fin Procesar

         

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