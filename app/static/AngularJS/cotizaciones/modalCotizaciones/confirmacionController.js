registrationModule.controller('confirmacionController', function($scope, $rootScope, $location, $timeout, alertFactory, confirmacionRepository, filterFactory, userFactory, globalFactory, datosBusqueda, plantillaRepository, cotizacionesRepository, direccionRepository) {


    $rootScope.initConfirmacion = function() {
        //$scope.spinner = true;
        //$scope.spinner = true;
        $scope.idPedidoBP = 0;

        $scope.msgEntregaBackorder = '';
        $scope.msgAvisoBackorder = '';
        $scope.msgTiempoEntrega = '';


        $scope.totalExistencia = -1;
        if ($scope.cotizacionActual.length > 0) {
            setTimeout(function() {
                $scope.spinner = $scope.spinner2 = false;
                $scope.$apply()
            }, 1)
        } else {
            if ($scope.folioActual != "TEMP") {
                cotizacionesRepository.getCotizacion($scope.folioActual).then(function(result) {
                    $scope.cotizacionActual = result.data;
                    setTimeout(function() {
                        $rootScope.guardarModal = false
                        $scope.guardar = false;
                        $scope.spinner = $scope.spinner2 = false;
                        $scope.$apply()
                    }, 10)
                });
            } else {
                $scope.spinner = false;
            }
        }
    };

    $scope.calcularTotal = function(op) {
        var totaltemp = 0;
        $scope.cotizacionActual.forEach(function(e) {
            console.log(e)
            if (op == 0) {
                totaltemp += e.PTS_PCOLISTA * e.cantidad
            } else if (op == 1) {
                totaltemp += e.PTS_PCOLISTA * (e.cantidad - e.faltante)
            }
        })
        $scope.total = $scope.$parent.$parent.total = totaltemp;


        if ($scope.totalExistencia > -1)
            $scope.total = $scope.totalExistencia;

    };

    $scope.selectBackorder = function() {
        $scope.backorder = $scope.$parent.$parent.backorder = true;
        $scope.sinbackorder = $scope.$parent.$parent.sinbackorder = false;
        $scope.calcularTotal(0)
    };
    $scope.selectSinBackorder = function() {
        $scope.backorder = $scope.$parent.$parent.backorder = false;
        $scope.sinbackorder = $scope.$parent.$parent.sinbackorder = true;
        $scope.calcularTotal(1)
    };
    $scope.$parent.$parent.hacerPedido = function(op) {
        new Promise(function(resolve, reject) {
            if (op == 0) {

                $scope.cadenaConfirma = ($scope.backorder) ? "<h4>Está a punto de realizar un pedido. ¿Está seguro que la dirección de entrega y su cotización es correcta?</h4><p><b><h4>" +
                    $scope.msgAvisoBackorder + "</h4></p></b>" : "<h4>Está a punto de realizar un pedido. ¿Está seguro que la dirección de entrega y su cotización es correcta?</h4>"

                bootbox.confirm($scope.cadenaConfirma,
                    function(result) {
                        if (result)
                            resolve(op)
                        else
                            reject(op)
                    }
                )
            }
            if (op == 1) {
                bootbox.confirm("<h4>Está a punto de realizar un pedido sin backorder. ¿Está seguro que la dirección de entrega y su cotización es correcta?</h4>",
                    function(result) {
                        if (result)
                            resolve(op)
                        else
                            reject(op)
                    }
                )
            } else if (op == 3) {
                resolve(op)
            }
        }).then(function(op) {
            new Promise(function(resolve, reject) {
                if ($scope.folioActual != "TEMP") {
                    var cotizacionGuardar = {
                        idCotizacion: $scope.folioActual,
                        refacciones: $scope.cotizacionActual,
                        total: $scope.total,
                    }
                    Cotizacion.update(cotizacionGuardar, function(data) {
                        resolve($scope.folioActual)
                    })

                } else {
                    Cotizacion.save({
                        idUsuario: $scope.user.per_idpersona,
                        refacciones: $scope.cotizacionActual,
                        descripcion: '',
                        total: $scope.total,
                        empresa: $scope.empresaActual.emp_idempresa, //LQMA comment 18102016 .emp_idempresa emp_nombrecto
                        sucursal: $scope.sucursalActual.AGENCIA, //LQMA comment 18102016 .suc_nombrecto .AGENCIA
                        base: ''
                    }, function(data) {
                        //LQMA 18102016
                        console.log(data)
                        $scope.$parent.$parent.folioActual = $scope.$parent.$parent.folioActual.replace('TEMP', data.idCotizacion);
                        resolve(data.idCotizacion)
                    })
                }
            }).then(function(idCotizacion) {
                console.log($scope.direccionActual)
                Pedido.save({
                    idUsuario: $scope.user.per_idpersona,
                    idCotizacion: idCotizacion,
                    idPersona: $scope.direccionActual.RTD_IDPERSONA,
                    concecutivo: $scope.direccionActual.RTD_CONSEC,
                    entrega: $scope.direccionActual.RTD_RTENTREGA,
                    operacion: op,
                    idPedido: $scope.idPedidoBP,
                }, function(data) {
                    if (data) {

                        console.log(data)
                        if (data.estatus == "ok") {

                            var folioBPRO = '';
                            if (data.idPedBPRO == "0")
                                folioBPRO = "<p><h4><font color='#1827F2'><B> Se ha generado un pedido en BACKORDER por las piezas faltantes.</B></font></h4>" +
                                "<p><h4><font color='#CB0A14'><B>" + $scope.msgEntregaBackorder + "</B></font></h4>"
                            else
                                folioBPRO = "<p><h4>Folio Pedido: <font color='#1827F2'><B> " + data.idPedBPRO + "</B></font></h4>" +
                                "<p><h4>Su token de entrega es: <font color='#1827F2'><B>" + data.token + "</B></font></h4>" +
                                "<p><h4><font color='#1E1A93'><B>" + $scope.msgTiempoEntrega + "</B></font></h4>"


                            console.log('back order?')
                            console.log(data.backOrder)

                            if (data.backOrder == "1")
                                folioBPRO = folioBPRO + "<p><h4><font color='#1827F2'><B>Se ha generado un pedido en BACKORDER por las piezas faltantes.</B></font></h4>" +
                                "<p><h4><font color='#CB0A14'><B>" + $scope.msgEntregaBackorder + "</B></font></h4>"

                            /*bootbox.alert("<h4>" + data.mensaje + "</h4>" +
                              "<p><h4>Folio Pedido: <font color='#1827F2'><B> " + folioBPRO + "</B></font></h4>" + 
                              "<p><h4>Su token de entrega es <font color='#1827F2'><B>" + data.token + "</B></font></h4>",
                              function() {
                                $state.go("user.cotizacion")
                              });*/

                            bootbox.alert("<h4>" + data.mensaje + "</h4>" + folioBPRO,
                                function() {
                                    $state.go("user.cotizacion")
                                });

                        } else if (data.estatus == "ko") {
                            toastr.info(data.mensaje)
                            $scope.backorder = $scope.$parent.$parent.backorder = true;

                            if (data.data[0].totalPorSurtir > 0) //totalPorSurtir
                                $scope.sinbackorderTotal = $scope.$parent.$parent.sinbackorderTotal = true;

                            $scope.sinbackorder = $scope.$parent.$parent.sinbackorder = true;

                            $scope.totalBackOrder = data.totalBackOrder;
                            $scope.totalExistencia = data.totalExistencia;

                            $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual = data.data;
                            $scope.idPedidoBP = data.idPedidoRef;
                        } else if (data.estatus == "cancelado") {
                            toastr.info(data.mensaje)
                            $state.go("user.cotizacion")
                        }
                    }
                })

            }, function() {});
        })
    };
});