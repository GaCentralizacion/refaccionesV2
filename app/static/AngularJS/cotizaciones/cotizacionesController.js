registrationModule.controller('cotizacionesController', function($scope, $rootScope, $location, $timeout, alertFactory, cotizacionesRepository, filterFactory, userFactory, globalFactory, datosBusqueda) {
    $scope.sucursalActual = $scope.empresaActual = null;
    $scope.listaCotizaciones = [];
    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        $('.chart').easyPieChart({
            barColor: "#8bc34a",
            "lineWidth": 8,
            "size": 115
        });


    };
    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'user').then(function(result) {
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
    $scope.getSucursales = function() {
        $scope.muestraAgencia = false;
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, 'user').then(function(result) {
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
    $scope.consultaSucursales = function() {
        $scope.muestraAgencia = false;
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, 'user').then(function(result) {
            if (result.data.length > 0) {
                $scope.muestraAgencia = true;
                console.log(result.data, 'Soy las sucursales ')
                $scope.sucursales = result.data;
                $scope.sucursalActual = $scope.sucursales[0];
                //$scope.cambioSucursal();

                //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                if (localStorage.getItem('cotSucursal') !== null) {

                    console.log('existe sucursal cotizacion')

                    $scope.cotSucursal = []

                    //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                    $scope.tempCotSuc = localStorage.getItem('cotSucursal')
                    $scope.cotSucursal.push(JSON.parse($scope.tempCotSuc))

                    console.log($scope.cotSucursal)

                    setTimeout(function() {

                        console.log('poniendo sucursal en cotizacion')
                        $("#selSucursales").val($scope.cotSucursal[0][0].AGENCIA);
                        $scope.sucursalActual = $scope.cotSucursal[0][0]; //$scope.empresas;

                        //$scope.consultaCotizaciones();
                        $scope.cambioSucursal();

                    }, 10);

                } //SET SUCURSAL DESDE LOCALSTORAGE  END
                filterFactory.styleFiltros();
            } else {
                $scope.muestraAgencia = false;
                alertFactory.success('No se encontraron empresas');
            }

        });
    }; //end consulta sucursales
    $scope.cambioSucursal = function() {
        $scope.consultaCotizaciones();

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

    }; //end cambio sucursales
    $scope.consultaCotizaciones = function() {
        cotizacionesRepository.getCotizaciones($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
            // $scope.lisCot = result.data;
            // $scope.listaCotizaciones = $scope.lisCot;
            $scope.pedidos = [{
                    folio: 1,
                    emp_nombre: 1,
                    NOMBRE_AGENCIA: 'AA-00-01',
                    descripcion: '30/01/2018',
                    total: '12'
                },
                {
                    folio: 2,
                    emp_nombre: 2,
                    NOMBRE_AGENCIA: 'AA-00-02',
                    descripcion: '30/01/2018',
                    total: '13'
                }
            ];
            $scope.listaCotizaciones = [$scope.pedidos];
            //$scope.$apply($scope.listaCotizaciones)
            console.log('SOY -las COTIZACIONES', $scope.listaCotizaciones)
            //$scope.listaCotizaciones = result.data;
            console.log('pinta limite credito')
            console.log($scope.sucursalActual.Con_LimCredito)

            if ($scope.sucursalActual.Con_LimCredito) {

                $scope.disponible = $scope.sucursalActual.Con_LimCredito - $scope.sucursalActual.descuento

                $('.chart').data('easyPieChart').update((($scope.sucursalActual.Con_LimCredito - $scope.sucursalActual.descuento) / $scope.sucursalActual.Con_LimCredito) * 100);
            }

            $('#tblCotizacionFiltros').DataTable().destroy();

            // setTimeout(function() {
            //     $('#tblCotizacionFiltros').DataTable()
            // }, 1)
            setTimeout(function() {
                $scope.setTablePaging('tblCotizacionFiltros');

                $("#tblCotizacionFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblCotizacionFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

            }, 1);
        });
    };
    $scope.borrarCotizacion = function(c) {
        bootbox.confirm("<h4>Deseas borrar permanentemente la cotizacion " + c.folio + "?</h4>", function(result) {
            if (result) {
                c.$delete({
                    id: c.idCotizacion
                }, function(data) {
                    console.log(data)
                    if (data.estatus == "ok") {
                        $scope.listaCotizaciones.forEach(function(d, n) {
                            if (d.idCotizacion == c.idCotizacion) {
                                $scope.listaCotizaciones.splice(n, 1);
                            }
                        })
                        toastr.info(data.mensaje)
                    }
                })
            }
        });
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
    }; //end setTablePaging
    $scope.nuevaCotizacion = function() {

        $rootScope.total = 0;
        $scope.salir = false;
        $rootScope.guardarModal = false;
        //$scope.cotizacionActual = [];
        $scope.direccionActual;
        $scope.page = 1;
        $scope.folioActual = "nueva" == "nueva" ? "TEMP" : $stateParams.id;
        $('.modal-cotizacion').modal('show')

        $('.modal-cotizacion').on('shown.bs.modal', function(e) {
            //var moveIt = $(".modal-backdrop").remove();
            //$("#modal-cotizacion-container").append(moveIt);
            $("#navbar").css("position", "static");
            $("#footer").css("position", "static");
        })

        $('.modal-cotizacion').on('hide.bs.modal', function(e) {
            if ($rootScope.guardarModal && !$scope.salir) {
                e.preventDefault()
                bootbox.confirm("<h4>Se perderan los cambios no guardados en la cotizacion actual, ¿Esta seguro de salir?</h4>", function(result) {
                    if (result) {
                        $scope.salir = true;
                        $('.modal-cotizacion').modal('hide')
                    }
                })
            }
        })

        $('.modal-cotizacion').on('hidden.bs.modal', function(e) {
            $("#navbar").css("position", "absolute");
            $("#footer").css("position", "absolute");
            //$state.go("user.cotizacion")
        })
        $('#demo-step-wz').bootstrapWizard({
            tabClass: 'wz-steps',
            nextSelector: '.next',
            previousSelector: '.previous',
            onTabClick: function(tab, navigation, index) {
                return false;
            },
            onInit: function() {
                $('#demo-step-wz').find('.finish').hide().prop('disabled', true);
            },
            onTabShow: function(tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;
                $scope.page = $current;
                var $percent = (index / $total) * 100;
                var wdt = 100 / $total;
                var lft = wdt * index;
                var margin = (100 / $total) / 2;
                $('#demo-step-wz').find('.progress-bar').css({
                    width: $percent + '%',
                    'margin': 0 + 'px ' + margin + '%'
                });

                if ($current == 1) {
                    $('#demo-step-wz').find('.previous').hide();
                } else {
                    $('#demo-step-wz').find('.previous').show();
                }

                if ($current == 1) { //Busqueda
                    //$scope.next = "cotizacion/" + $stateParams.id + "/entrega/"
                    $scope.previous = "none"
                } else if ($current == 2) { //Entrega
                    //$scope.previous = "cotizacion/" + $stateParams.id + "/busqueda/"
                    //$scope.next = "cotizacion/" + $stateParams.id + "/confirmacion/"
                } else if ($current == 3) { //Confirmacion
                    //$scope.previous = "cotizacion/" + $stateParams.id + "/entrega/"
                }
                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $('#demo-step-wz').find('.next').hide();
                    $('#demo-step-wz').find('.finish').show();
                    $('#demo-step-wz').find('.finish').prop('disabled', false);
                } else {
                    $('#demo-step-wz').find('.next').show();
                    $('#demo-step-wz').find('.finish').hide().prop('disabled', true);
                }
            }
        });
        $rootScope.initModal();
    }
});