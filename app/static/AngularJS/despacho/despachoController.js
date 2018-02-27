registrationModule.controller('despachoController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, direccionRepository, despachoRepository, filterFactory, userFactory, globalFactory) {


$scope.gridRutas = false;

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();

    };


    $scope.ver = function(elementoRuta) {
        $scope.rutaDetalle = elementoRuta;

        direccionRepository.getDireccionesRuta(elementoRuta.idRuta).then(function(result) {

            $scope.pedidoDireccionesRuta = result.data;
            $scope.numDirRut = result.data.length;
            $('#modalDetalleRuta').modal('show');
        });

    };

    $scope.cambioEmpresa = function() {
        $scope.OperadoresUnidadesRutas = [];
        $('#tblOperadoresUnidadesRutas').DataTable().destroy();
        if ($scope.empresaActual.emp_idempresa > 0) {
            $scope.newRuta = false;

            despachoRepository.getRutas($scope.empresaActual.emp_idempresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.gridRutas = true;
                    $scope.OperadoresUnidadesRutas = result.data;
                    setTimeout(function() {
                        $scope.setTablePaging('tblOperadoresUnidadesRutas');
                        $("#tblOperadoresUnidadesRutas_length").removeClass("dataTables_info").addClass("hide-div");
                        $("#tblOperadoresUnidadesRutas_filter").removeClass("dataTables_info").addClass("pull-left");

                    }, 1);
                } else $scope.gridRutas = false;
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