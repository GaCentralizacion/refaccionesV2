registrationModule.controller('rutaController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, rutaRepository, filterFactory, userFactory, globalFactory, operadorRepository, unidadRepository, direccionRepository) {



    $scope.dirForadd = [];
    $scope.verTot = false;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        //   $scope.clean();

// Array.prototype.diff = function(a) {
//     return this.filter(function(i) {return a.indexOf(i) < 0;});
// };



$scope.a=[{id:1,nom:'uno'},
            {id:2,nom:'dos'},
            {id:3,nom:'tres'},
            {id:4,nom:'cuatro'}];

            $scope.b=[
            {id:2,nom:'dos'},
            {id:3,nom:'tres'}];

//          //   var ladif=$scope.listN.diff( $scope.listM);
//          var ladif = $($scope.listM).not( $scope.listN).get();
//             console.log(ladif); 



// var array_one = [1,2,3,4];
// var array_two = [1,3,4,5,6]

// var difference = $(array_one).not(array_two).get();

// console.log(difference);

var onlyInA = $scope.a.filter( $scope.comparer($scope.b));
var onlyInB = $scope.b.filter( $scope.comparer($scope.a));

result = onlyInA.concat(onlyInB);

console.log(result);

    };





        $scope.comparer = function(otherArray) {
            return function(current){
            return otherArray.filter(function(other){
            return other.id == current.id 
            }).length == 0;
            }
        };


    $scope.clean = function() {
        $scope.listOperadores = [];
        $scope.listUnidades = [];
        $scope.listRutas = [];
        $scope.bloquea = false;
        $scope.add = false;
        $scope.tipo = 1;
        $scope.txtr = 'Ver Rutas';
        $scope.txto = 'Ver Operadores';
        $scope.txtu = 'Ver Unidades';

        $scope.nombreOperador = "";
        $scope.idOperador = "";
        $scope.telefonoOperador = "";

        $scope.descripcionUni = "";
        $scope.descripcion = "";
        $scope.modelo = "";
        $scope.color = "";
        $scope.placas = "";
        $scope.Tipo = "";
        $scope.capacidad = "";
        $scope.metrosCubicos = "";
        $scope.idUnidad = "";
        $scope.vero = false;
        $scope.verr = false;
        $scope.veru = false;
        $scope.rutDir = false;
        $scope.verd = true;
        $scope.addDireccion = false;
        $scope.verdir = false;
        $scope.btnSave = false;
        $scope.newRuta = false;
        $scope.gridRutas = true;



        $scope.addOperador = false;
        $scope.addUnidad = false;
        $('#tblRutas').DataTable().destroy();
        $('#tblOperadores').DataTable().destroy();
        $('#tblUnidades').DataTable().destroy();
        $('#tblUnidades').DataTable().destroy();
        $scope.OperadoresUnidadesRutas = [
            { ruta: 'SUR', operador: 'JOSÉ JOSÉ', unidad: 'BMW 2015', colorsit: 'green', situacion: 'Proseso' },
            { ruta: 'LENTA', operador: 'PEDRO', unidad: 'CHEVROLET 2018', colorsit: 'brown', situacion: 'En Espera' },
            { ruta: 'RAPIDA', operador: 'OMAR', unidad: 'HONDA 2016', colorsit: 'purple', situacion: 'Finalizada' },
            { ruta: 'NORTE', operador: 'JOSÉ', unidad: 'HONDA 2016', colorsit: 'red', situacion: 'Cancelada' },
        ];
    };



    $scope.panelDirecciones = function() {
        $scope.addDireccion = true;
    };
    $scope.getDirecciones = function() {

        $('#tblDirecc').DataTable().destroy();
        var datos = {
            idUsuario: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: 3,
            opcion: 1,
            idEstatus: 1
        }
        direccionRepository.getDirecciones(datos).then(function(result) {
            console.log(result.data, 'Soy las direcciones encontradas')
            $scope.direcciones = result.data;
            setTimeout(function() {
                $scope.setTablePaging('tblDirecc');

                $("#tblDirecc_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblDirecc_filter").removeClass("dataTables_info").addClass("pull-left");
                $('#modal-panelRuta').modal('hide');
                $('#modalDirecc').modal('show');

            }, 1);


        });
    };

    $scope.direccionPara = function(tipo) {
        $('#tbldireccSel').DataTable().destroy();
        angular.forEach($scope.direcciones, function(value, key) {
            if (value.seleccionada == true) $scope.dirForadd.unshift(value);
        });
        setTimeout(function() {
            $scope.setTablePaging('tbldireccSel');
            $("#tbldireccSel_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tbldireccSel_filter").removeClass("dataTables_info").addClass("pull-left");
        }, 1);

        $scope.rutDir = true;
        $scope.verdir = true;
        $('#modal-panelRuta').modal('show');
        $scope.lengthDirSell = $scope.dirForadd.length;
        $scope.verTot = true;
        //$scope.addOperador = true;
    };

    $scope.panelOperadores = function() {
        $scope.addOperador = true;
    };

    $scope.getOperadores = function() {
        $('#tblOperadores').DataTable().destroy();
        $scope.listOperadores = [];
        if ($scope.empresaActual.emp_idempresa != 0) {
            operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.listOperadores = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblOperadores');

                        $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");
                        $('#modal-panelRuta').modal('hide');
                        $('#modalOperador').modal('show');
                    }, 1);
                } else {
                    alertFactory.info("No se encontraron resultados !!");
                    $scope.listOperadores = [];
                }
            });
        } else { $scope.listOperadores = []; }
    };

    $scope.panelUnidades = function() {
        $scope.addUnidad = true;
    };

    $scope.getUnidades = function() {
        $('#tblUnidades').DataTable().destroy();
        $scope.listUnidades = [];
        if ($scope.empresaActual.emp_idempresa != 0) {
            unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.listUnidades = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblUnidades');

                        $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");
                        $('#modal-panelRuta').modal('hide');
                        $('#modalUnidad').modal('show');
                    }, 1);
                } else {
                    alertFactory.info("No se encontraron resultados !!");
                    $scope.listUnidades = [];
                }
            });
        } else { $scope.listUnidades = []; }
    };

    $scope.seleccionaUni = function(unidad) {
        $scope.descripcionUni = unidad.descripcion;
        $scope.modelo = unidad.modelo;
        $scope.color = unidad.color;
        $scope.placas = unidad.placas;
        $scope.Tipo = unidad.Tipo;
        $scope.capacidad = unidad.capacidad;
        $scope.metrosCubicos = unidad.metrosCubicos;
        $scope.idUnidad = unidad.idUnidad;
        $('#modal-panelRuta').modal('show');
        $('#modalUnidad').modal('hide');
        $scope.txtu = 'Cambia Unidad';
        $scope.veru = true;
        // $scope.btnSave = true;

    };

    $scope.ultimoPaso = function() {
        $scope.verHeader = true;
    };

    $scope.atrasSave = function() {
        $scope.verHeader = false;
    };



    $scope.salir = function() {

        new Promise(function(resolve, reject) {

            $scope.cadenaConfirma = "<h4>Está a punto de salir  ¿Desea continuar?</h4>"
            //   else $scope.cadenaConfirma = "<h4>Está a punto de eliminar al operador "+ $scope.nombre+" "+$scope.apPaterno+" "+$scope.apMaterno+ "¿Desea continuar?</h4>"

            bootbox.confirm($scope.cadenaConfirma,
                function(result) {
                    if (result) resolve(1)
                    else reject(2)
                }
            )
        }).then(function(operacion) {
            new Promise(function(resolve, reject) {
                //   if($scope.bloquea==true)$scope.tipo=0;
                var datos = {
                    nombreRuta: $scope.nombreRuta,
                    descripcion: $scope.descripcion,
                    idResponsable: $scope.Usuario.idUsuario,
                    idEmpresa: $scope.empresaActual.emp_idempresa
                };

                if ($scope.add == true)
                    rutaRepository.postCreate(datos).then(function(result) {
                        $scope.clean();

                        resolve(result.data);
                    });
                else {
                    datos.idRuta = $scope.idOperador;
                    datos.estatus = $scope.tipo;
                    rutaRepository.postUpdate(datos).then(function(result) {
                        //    $scope.limpaValores();
                        resolve(result.data);
                    });
                }


            }).then(function(YES) {

                if (respuesta.estatus = 'ok') {
                    //    $scope.cambioEmpresa();
                    bootbox.alert("<h4> Operacion realizada!!. </h4>",
                        function() {
                            $('#modalAddRuta').modal('hide')
                        });

                } else { //error al guardar
                    bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                        function() {
                            $('#modalAddRuta').modal('hide')
                            //$state.go("user.aprobacion")
                        });
                }


            });

        }); //fin promise  



    };


    $scope.seleccionaOpe = function(operador) {
        $scope.nombreOperador = operador.nombre + " " + operador.apellidoPaterno + " " + operador.apellidoMaterno
        $scope.telefonoOperador = operador.telefono;
        $scope.idOperador = operador.idOperador;
        $('#modalOperador').modal('hide');
        $('#modal-panelRuta').modal('show');
        $scope.txto = 'Cambia Operador';
        $scope.vero = true;
        $scope.addUnidad = true;
    };

    $scope.changePanel = function() {
        $('#modal-panelRuta').modal('show');
    };
    $scope.cambioEmpresa = function() {
        $scope.clean();
        $('#tblOperadoresUnidadesRutas').DataTable().destroy();
        $scope.OperadoresUnidadesRutas = [
            { ruta: 'SUR', operador: 'JOSÉ JOSÉ', unidad: 'BMW 2015', colorsit: 'green', situacion: 'Proseso' },
            { ruta: 'LENTA', operador: 'PEDRO', unidad: 'CHEVROLET 2018', colorsit: 'brown', situacion: 'En Espera' },
            { ruta: 'RAPIDA', operador: 'OMAR', unidad: 'HONDA 2016', colorsit: 'purple', situacion: 'Finalizada' },
            { ruta: 'NORTE', operador: 'JOSÉ', unidad: 'HONDA 2016', colorsit: 'red', situacion: 'Cancelada' },
        ];
        setTimeout(function() {
            $scope.setTablePaging('tblOperadoresUnidadesRutas');

            $("#tblOperadoresUnidadesRutas_length").removeClass("dataTables_info").addClass("hide-div");
            $("#tblOperadoresUnidadesRutas_filter").removeClass("dataTables_info").addClass("pull-left");

        }, 1);
        $scope.getOperadoresL();
            $scope.getUnidadesL();
        
    };

    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'user').then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las empresas ')
                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                //SET EMPRESA LOCALSTORAGE   BEGIN
                if (localStorage.getItem('pedEmpresa') !== null) {
                    $scope.pedEmpresa = [];
                    $scope.tempPedEmp = localStorage.getItem('pedEmpresa');
                    $scope.pedEmpresa.push(JSON.parse($scope.tempPedEmp));
                    setTimeout(function() {
                        $("#selEmpresas").val($scope.pedEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.pedEmpresa[0][0];
                    }, 100);
                }
            } else {
                alertFactory.success('No se encontraron empresas');
            }
        });
    };



    $scope.editar=function(elementoRuta){

       $scope.nombreRuta=elementoRuta.ruta;
         $scope.nombreOperador=elementoRuta.operador;
          $scope.descripcionUni=elementoRuta.unidad;

           $('#modal-panelRuta').modal('show');


    };


        $scope.getOperadoresL = function() {
     
        if ($scope.empresaActual.emp_idempresa != 0) {
            operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                     console.log('ope:::');
                    console.log(result.data);
                     $scope.operadores = result.data;
                       $scope.operadores.unshift({nombre:'Selecciona Operador..'});
                    $scope.operadorActual = $scope.operadores[0];
                   
                } 
            });
        } 
    };



       $scope.getUnidadesL = function() {
       
        if ($scope.empresaActual.emp_idempresa != 0) {
            unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                     console.log('uni:::');
                    console.log(result.data);
                    $scope.unidades = result.data;
                      $scope.unidades.unshift({nomCompleto:'Selecciona unidad..'});
                     $scope.unidadActual = $scope.unidades[0];
                 
                } 
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