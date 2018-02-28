registrationModule.controller('despachoController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory,rutaRepository, direccionRepository, despachoRepository, filterFactory, userFactory, globalFactory) {


    $scope.gridRutas = false;
    $scope.verdir = false;
    $scope.direcciones = [];
    $scope.dirForadd = [];
        $scope.seleccionado = [];
    $scope.editar = false;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();

    };


   $scope.editarR = function(elementoRuta) {

      
        $scope.add = false;
        $scope.idRuta = elementoRuta.idRuta;
        $scope.nombreRuta = elementoRuta.ruta;
        $scope.descripcionUni = elementoRuta.unidad;
        $scope.nombreOperador = elementoRuta.operador;
        $scope.descripcion = elementoRuta.descripcion;
        $scope.idUnidad = elementoRuta.idUnidad;
        $scope.idOperador = elementoRuta.idOperador;
         $("#rutaActual").val(elementoRuta.nombreRuta);



        $scope.dirForadd = [];

        direccionRepository.getDireccionesRuta(elementoRuta.idRuta).then(function(result) {
            $scope.editar = true;
            $scope.dirForadd = result.data;
            $scope.direccionesTe = result.data;


            $scope.rutDir = true;
            $scope.verdir = true;
            $('#modalAddDespacho').modal('show');
            // $scope.totalPedidos = $scope.dirForadd.length;
            $scope.verTot = true;
        });
    };

    $scope.despacho = function(tipo) {

        new Promise(function(resolve, reject) {

            if ($scope.bloquea == false) $scope.cadenaConfirma = "<h4>Está a punto de confirmar el Despacho de los pedidos ¿Desea continuar?</h4>"
            else $scope.cadenaConfirma = "<h4>Está a punto de eliminar el despacho ¿Desea continuar?</h4>"

            bootbox.confirm($scope.cadenaConfirma,
                function(result) {
                    if (result) resolve(1)
                    else reject(2)
                }
            )

        }).then(function() {
            new Promise(function(resolve, reject) {
                if ($scope.bloquea == true) $scope.tipo = 0;

                var datos = {
                    idRuta:$scope.rutaActual.idRuta,
                    direcciones: $scope.dirForadd
                };

                if ($scope.add == true) {

                    despachoRepository.postCreate(datos).then(function(result) {

                        resolve(result.data);
                        $scope.limpiar();
                    });
                } else {
                    datos.idRuta = $scope.idRuta;
                    datos.tipo = $scope.tipo;
                    despachoRepository.postUpdate(datos).then(function(result) {
                        resolve(result.data);
                        $scope.limpiar();
                    });
                }


            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    $scope.cambioEmpresa();
                    bootbox.alert("<h4> Operacion realizada!!. </h4>",
                        function() {
                            $('#modal-panelRuta').modal('hide')
                        });

                } else {
                    bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                        function() {
                            $('#modal-panelRuta').modal('hide')

                        });
                }


            });

        }); //fin promise     

    };


    $scope.modalDespacho = function(despacho, tipo) {

        $('#modalAddDespacho').modal('show');
        if (tipo == 1) {
            $scope.add = true;
            $scope.bloquea = false;
        }
        if (tipo == 2) {
            $scope.add = false;
            $scope.bloquea = false;
               $scope.editarR(despacho);

        } else if (tipo == 3) {
            $scope.add = false;
            $scope.bloquea = true;
               $scope.editarR(despacho);
        }
      
    };

    $scope.verDirecciones = function() {

        $('#tblDirecc').DataTable().destroy();

        direccionRepository.getDireccionesAll().then(function(result) {
            $scope.direcciones = [];
            $scope.resultado = result.data;

            if ($scope.editar == true) {

                $scope.direcciones = $scope.resultado;
                $scope.direcciones = $scope.resultado.filter($scope.comparer($scope.dirForadd));

                if ($scope.seleccionado.length > 0) {
                    angular.forEach($scope.seleccionado, function(value, key) {
                        $scope.direcciones.unshift(value);
                    });

                }



            } else {


                if ($scope.dirForadd.length > 0) {

                    var onlyInA = $scope.resultado.filter($scope.comparer($scope.dirForadd));
                    var onlyInB = $scope.dirForadd.filter($scope.comparer($scope.resultado));

                    $scope.direcciones = onlyInA.concat(onlyInB);
                } else {

                    $scope.direcciones = $scope.resultado;

                }

            }

            setTimeout(function() {
                $scope.setTablePaging('tblDirecc');

                $("#tblDirecc_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblDirecc_filter").removeClass("dataTables_info").addClass("pull-left");
                $('#modalAddDespacho').modal('hide');
                $('#modalDirecc').modal('show');

            }, 1);


        });
    };



    $scope.direccionParaRuta = function(tipo) {
        $scope.resUnidad = true;
        $('#tbldireccSel').DataTable().destroy();
        angular.forEach($scope.direcciones, function(value, key) {

            if (value.seleccionada == true) {
                $scope.dirForadd.unshift(value);
            }
        });

        $scope.rutDir = true;
        $scope.verdir = true;
        $('#modalAddDespacho').modal('show');
        $scope.lengthDirSell = $scope.dirForadd.length;
        $scope.verTot = true;

    };


    $scope.ver = function(elementoRuta) {
        $scope.rutaDetalle = elementoRuta;

        direccionRepository.getDireccionesRuta(elementoRuta.idRuta).then(function(result) {
                console.log(result.data);
            $scope.pedidoDireccionesRuta = result.data;
            $scope.numDirRut = result.data.length;
            $('#modalDetalleDespacho').modal('show');
        });

    };

    $scope.cambioEmpresa = function() {
        $scope.OperadoresUnidadesRutas = [];
        $('#tblDespachos').DataTable().destroy();
        if ($scope.empresaActual.emp_idempresa > 0) {
            $scope.newRuta = false;
            $scope.catalogoRutas();

            despachoRepository.getRutas($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.gridDespachos = true;
                    $scope.OperadoresUnidadesRutas = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblDespachos');
                        $("#tblDespachos_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblDespachos_filter").removeClass("dataTables_info").addClass("pull-left");

                    }, 1);
                } else $scope.gridDespachos = false;
            });
        } else $scope.newRuta = true;
    };


    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las empresas ')
                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                //SET EMPRESA LOCALSTORAGE   BEGIN
                if (localStorage.getItem('pedEmpresa') !== null) {

                    $scope.pedEmpresa = []

                    $scope.tempPedEmp = localStorage.getItem('pedEmpresa')
                    $scope.pedEmpresa.push(JSON.parse($scope.tempPedEmp))

                    console.log('$scope.pedEmpresa')
                    console.log($scope.pedEmpresa[0][0])

                    setTimeout(function() {

                        $("#selEmpresas").val($scope.pedEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.pedEmpresa[0][0]; //$scope.empresas;


                    }, 100);

                }

            } else {
                alertFactory.success('No se encontraron empresas');
            }
        });

    };


    $scope.rowC = function(elemto) {

        $scope.seleccionado = [];
        $scope.seleccionado.unshift(elemto);
    };


    $scope.catalogoRutas = function() {
        rutaRepository.getCatalogoRutas($scope.empresaActual.emp_idempresa).then(function(result) {

            if (result.data.length > 0) {
                $scope.rutas = result.data;
                $scope.rutas.unshift({ nombreRuta: "Seleccioné Ruta..." });
                $scope.rutaActual = $scope.rutas[0];
                $scope.hideListCatRut = false;
            } else { $scope.hideListCatRut = true; }

        });
    };

    $scope.cambioPlantillaRuta = function() {
        if ($scope.rutaActual.idRuta > 0) {
            $scope.inputNewRuta = false;
            $scope.nombreRuta = $scope.rutaActual.nombreRuta;
        } else {
            $scope.inputNewRuta = true;
            $scope.nombreRuta = "";
        }
    };

    $scope.comparer = function(otherArray) {
        return function(current) {
            return otherArray.filter(function(other) {
                return other.pre_pedidobpro == current.pre_pedidobpro
            }).length == 0;
        }
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




});