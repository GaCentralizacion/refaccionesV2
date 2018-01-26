registrationModule.controller('cotizacionesController', function($scope, $rootScope, $location, $timeout, alertFactory, cotizacionesRepository, filterFactory, userFactory, globalFactory) {
    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        //Inicio Variables 
        $scope.tablaUnidaddes = false;
    };
    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario,'admin').then(function(result) {
            if (result.data.length > 0) {
                console.log(result.data, 'Soy las empresas ')
                $scope.empresas = result.data;
                filterFactory.styleFiltros();
            } else {
                alertFactory.success('No se encontraron empresas');
            }

        });
    };
    $scope.getSucursales = function() {
        $scope.muestraAgencia = false;
        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresa.emp_idempresa, 'admin').then(function(result) {
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
    $scope.getUnidadesIngresadas = function() {
        unidadesIngresadasRepository.getUnidadesIngresadas($scope.empresa, $scope.sucursal).then(function(result) {
            if (result.data.length > 0) {
                $scope.tablaUnidaddes = true;
                console.log(result.data, 'Somos las unidades con estatus ingresadas');
                $scope.unidades = result.data;
                globalFactory.filtrosTablaSelect('unidaddesIngresadas', 'Unidades con Estatus Ingresada', 10);
            } else if (result.data.length == 0) {
                $scope.tablaUnidaddes = false;
                alertFactory.info('No se encontraron unidades ingresadas')
            } else {
                $scope.tablaUnidaddes = false;
                alertFactory.error('Ocurrio un problema');
            }

        });
    };
    $scope.enviarNotificacion = function() {
        var contador = 0;
        $scope.numeroNotificaciones = 0;
        console.log($scope.unidades, 'Soy las seleccionadas');
        angular.forEach($scope.unidades, function(value, key) {
            if (value.seleccionada == true) {
                contador++;
            }
        });
        console.log('total seleccionados', contador)
        ////////////////////////////////////////////////////////////////////////////        
        $scope.unidades.reduce(
            function(sequence, value) {
                console.log(sequence);
                return sequence.then(function() {
                    return $scope.insertaNotificaciones(value);
                }).then(function(obj) {

                });
            },
            Promise.resolve()
        ).then(function() {
            console.log('COMPLETED');
            alertFactory.success($scope.numeroNotificaciones + ' Notificaciones enviadas')
            $scope.getUnidadesIngresadas();
        });
    };
    $scope.insertaNotificaciones = function(value) {

        if (value.seleccionada == true) {
            console.log('Entre a donde insertare', value);
            var notificacion = [{
                numeroSerie: value.numeroSerie,
                solicitante: $scope.Usuario.idUsuario,
                idEmpresa: $scope.empresa,
                idSucursal: $scope.sucursal
            }]
            return new unidadesIngresadasRepository.insertNotificacion(notificacion).then(function(result) { //me falta back
                console.log(result.data)
                var respuesta = result.data[0];
                if (respuesta.estatus == 1) {
                    $scope.numeroNotificaciones++;
                    return respuesta;
                }
            });
            // unidadesIngresadasRepository.insertNotificacion(notificacion).then(function(result) { //me falta back
            //     console.log(result.data)
            //     var respuesta = result.data[0];
            //     if (respuesta.estatus == 1) {
            //         $scope.numeroNotificaciones++;
            //         return respuesta;
            //     }
            // });

        } else {
            return 0
        }

    };
    ////////////////////////////////////////////////////////////////////////////
    // function promiseSqrt(value) {
    //     return new Promise(function(fulfill, reject) {
    //         console.log('START execution with value =', value);
    //         setTimeout(function() {
    //             fulfill({ value: value, result: value * value });
    //         }, 0 | Math.random() * 3000);
    //     });
    // }

    // var p = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // p.reduce(
    //     function(sequence, value) {

    //         console.log(sequence);
    //         return sequence.then(function() {
    //             return promiseSqrt(value);
    //         }).then(function(obj) {
    //             console.log('END execution with value =', obj.value,
    //                 'and result =', obj.result);
    //         });
    //     },
    //     Promise.resolve()
    // ).then(function() {
    //     console.log('COMPLETED');
    // });
    ///////////////////////////////////////////////////////////////////////// 



});