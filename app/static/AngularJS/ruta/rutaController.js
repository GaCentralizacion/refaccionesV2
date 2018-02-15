registrationModule.controller('rutaController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, rutaRepository, filterFactory, userFactory, globalFactory, operadorRepository, unidadRepository) {


    $scope.listOperadores = [];
    $scope.bloquea = false;
    $scope.add = false;
    $scope.tipo = 1;
    $scope.txto='Elige Operador... ';
    $scope.txtu='Elige Unidad... ';
  
    $scope.nombreOperador="";
    $scope.idOperador="";
    $scope.telefonoOperador="";

    $scope.descripcionUni="";
    $scope.modelo="";
    $scope.color="";
    $scope.placas="";
    $scope.Tipo="";
    $scope.capacidad="";
    $scope.metrosCubicos="";
    $scope.idUnidad="";
    $scope.vero=false;
    $scope.veru=false;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        $scope.newRuta();

    };


    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'user').then(function(result) {
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

  $scope.seleccionaOpe= function(operador) {
    $scope.nombreOperador = operador.nombre +" "+operador.apellidoPaterno+" "+operador.apellidoMaterno
    $scope.telefonoOperador=operador.telefono;
    $scope.idOperador=operador.idOperador;
    $('#modalOperador').modal('hide');
    $scope.txto='Cambia Operador... ';
     $scope.vero=true;
  };

  $scope.seleccionaUni = function(unidad) {
    $scope.descripcionUni=unidad.descripcion;
    $scope.modelo=unidad.modelo;
    $scope.color=unidad.color;
    $scope.placas=unidad.placas;
    $scope.Tipo=unidad.Tipo;
    $scope.capacidad=unidad.capacidad;
    $scope.metrosCubicos=unidad.metrosCubicos;
    $scope.idUnidad=unidad.idUnidad;
      $('#modalUnidad').modal('hide');
    $scope.txtu='Cambia Unidad... ';
    $scope.veru=true;

  };


    // $scope.cambioEmpresa=function(){
    //    $('#tblOperadores').DataTable().destroy();
    //    $scope.listOperadores=[]; 
    //     if($scope.empresaActual.emp_idempresa!=0){
    //         operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result){
    //             if(result.data.length>0){
    //             $scope.listOperadores=result.data;
    //                     setTimeout(function() {
    //                         $scope.setTablePaging('tblOperadores');

    //                         $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
    //                         $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");

    //                     }, 1);
    //                 }else { alertFactory.info("No se encontraron resultados !!"); $scope.listOperadores=[];}
    //         });
    //     }else{$scope.listOperadores=[];}
    // };

    $scope.newRuta = function() {
        $scope.setTablePaging('tblOperadoresUnidadesRutas');

        $("#tblOperadoresUnidadesRutas_length").removeClass("dataTables_info");
        $("#tblOperadoresUnidadesRutas_filter").removeClass("dataTables_info").addClass("pull-left");
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
                        $('#modalOperador').modal('show');
                    }, 1);
                } else { alertFactory.info("No se encontraron resultados !!");
                    $scope.listOperadores = []; }
            });
        } else { $scope.listOperadores = []; }
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
                              $('#modalUnidad').modal('show');
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