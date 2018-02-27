registrationModule.controller('unidadController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, unidadRepository, filterFactory, userFactory, globalFactory) {


    $scope.listUnidades = [];
    $scope.bloquea = false;
    $scope.add = false;
    $scope.tipo = 1;


    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();


    };


    $scope.getPesoUni = function() {
        unidadRepository.getPesoUni().then(function(result) {

            $scope.pesos = result.data; //[{idTipoCarga:1,tipo:'camion'},{idTipoCarga:2,tipo:'tracktor'}];
            $scope.pesos.unshift({idPesoUnidad:0, descpeso: "Seleccioné Tipo de Peso..." });
            
            $scope.pesoActual = $scope.pesos[0];
            console.log($scope.pesos)
            console.log($scope.pesos[0])
        });

    };

    $scope.getTipoCarga = function() {
        unidadRepository.getTiposUnidades().then(function(result) {

            $scope.tipos = result.data; //[{idTipoCarga:1,tipo:'camion'},{idTipoCarga:2,tipo:'tracktor'}];
            $scope.tipos.unshift({ Descripcion: "Seleccioné Tipo de Carga..." });
            $scope.tipoActual = $scope.tipos[0];
        });

    };

    $scope.getMarca = function() {

        unidadRepository.getMarcas().then(function(result) {
            $scope.marcas = result.data; // [{idMarca:1,descripcion:'HONDA'},{idMarca:2,descripcion:'BMW'}];
            $scope.marcas.unshift({ descripcion: "Seleccioné Marca..." });
            $scope.marcaActual = $scope.marcas[0];
        });

    };


    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'admin').then(function(result) {
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
        $scope.getMarca();
        $scope.getTipoCarga();
        $scope.getPesoUni();
        

    };


    $scope.unidad = function(tipo) {


        new Promise(function(resolve, reject) {

            if ($scope.bloquea == false) $scope.cadenaConfirma = "<h4>Está a punto de confirmar  la unidad " + $scope.marcaActual.descripcion + " " + $scope.modelo + " ¿Desea continuar?</h4>"
            else $scope.cadenaConfirma = "<h4>Está a punto de eliminar la unidad ¿Desea continuar?</h4>"

            bootbox.confirm($scope.cadenaConfirma,
                function(result) {
                    if (result) resolve(1)
                    else reject(2)
                }
            )
        }).then(function(operacion) {
            new Promise(function(resolve, reject) {
                if ($scope.bloquea == true) $scope.tipo = 0;
                var datos = {
                    numserie: $scope.numserie,
                    idMarca: $scope.marcaActual.idMarca,
                    modelo: $scope.modelo,
                    color: $scope.color,
                    placas: $scope.placas,
                    idTipoCarga: $scope.tipoActual.idTipoCarga,
                    capacidad: $scope.capacidad,
                    metrosCubicos: $scope.metroscu,
                    idEmpresa: $scope.empresaActual.emp_idempresa,
                    anio: $scope.anio,
                    peso:$scope.pesoActual.idPesoUnidad

                };
                console.log(datos);

                if ($scope.add == true){
                    console.log(datos);
                    unidadRepository.postCreate(datos).then(function(result) {
                       
                        resolve(result.data);
                    });
                }else {
                    datos.idUnidad = $scope.idUnidad;
                    datos.estatus = $scope.tipo;
                    console.log(datos);
                    unidadRepository.postUpdate(datos).then(function(result) {
                      
                        resolve(result.data);
                    });
                }


            }).then(function(respuesta) {

                $scope.idUnidad = "";
                $scope.modelo = "";
                $scope.color = "";
                $scope.placas = "";
                $scope.capacidad = "";
                $scope.numserie = "";
                $scope.metroscu = "";
                $scope.marcaActual = $scope.marcas[0];
                $scope.tipoActual = $scope.tipos[0];

                if (respuesta.estatus = 'ok') {
                    $scope.cambioEmpresa();
                    bootbox.alert("<h4> Operacion realizada!!. </h4>",
                        function() {
                            $('#modalAddOperador').modal('hide')
                        });

                } else { //error al guardar
                    bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                        function() {
                            $('#modalAddOperador').modal('hide')
                            //$state.go("user.aprobacion")
                        });
                }


            });

        }); //fin promise     

    };

    $scope.limpaValores = function() {

        $scope.tipo = 1;
        $scope.bloquea = false;
        $scope.add = false;



    };

    $scope.modalUnidad = function(unidad, tipo) {
        // $scope.marcaActual = $scope.marcas[0];
        // $scope.tipoActual = $scope.tipos[0];
        $('#modalAddUnidad').modal('show');
        if (tipo == 1) {
            $scope.add = true;
            $scope.bloquea = false;
            $scope.marcaActual = $scope.marcas[0];
            $scope.tipoActual = $scope.tipos[0];
        }
        if (tipo == 2) {
            $scope.add = false;
            $scope.bloquea = false;
        } else if (tipo == 3) {
            $scope.add = false;
            $scope.bloquea = true;
        }
        if (unidad != null) {

            $("#marca").val(unidad.idMarca);
            //  $scope.marcaActual = $scope.pedEmpresa[0][0]; //$scope.empresas;
            $("#tipo").val(unidad.idTipoCarga);
            $("#pesos").val(unidad.idPesoUnidad);
            //  $scope.tipoActual = $scope.pedEmpresa[0][0]; //$scope.empresas;
            $scope.marcaActual.idMarca = unidad.idMarca;
            $scope.tipoActual.idTipoCarga = unidad.idTipoCarga;
            $scope.idUnidad = unidad.idUnidad;
            $scope.modelo = unidad.modelo;
            $scope.color = unidad.color;
            $scope.placas = unidad.placas;
            $scope.capacidad = unidad.capacidad;
            $scope.numserie = unidad.numeroSerie;
            $scope.metroscu = unidad.metrosCubicos;
            $scope.anio = unidad.anio;
            $scope.pesoActual.idPesoUnidad = unidad.idPesoUnidad;

        }
    };

    $scope.cambioEmpresa = function() {

 

        $('#tblUnidades').DataTable().destroy();
        $scope.listUnidades = [];
        if ($scope.empresaActual.emp_idempresa != 0) {
            unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.listUnidades = result.data;
                    console.log(result.data);
                    setTimeout(function() {
                        $scope.setTablePaging('tblUnidades');

                        $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");

                    }, 1);
                } else { alertFactory.info("No se encontraron resultados !!");
                    $scope.listUnidades = []; }
            });
        } else { $scope.listUnidades = []; }
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