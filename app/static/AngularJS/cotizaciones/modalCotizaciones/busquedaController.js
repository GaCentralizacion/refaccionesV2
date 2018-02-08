registrationModule.controller('busquedaController', function($scope, $rootScope, $location, $timeout, alertFactory, busquedaRepository, filterFactory, userFactory, globalFactory, datosBusqueda, plantillaRepository, cotizacionesRepository) {

    // $scope.initModal = function() {
    //     $scope.Usuario = userFactory.getUserData();
    //     $scope.getEmpresas();
    //     $scope.sucursalActual = $scope.empresaActual = null;
    //     $scope.listaCotizaciones = [];
    //     $scope.busquedaActual = [];
    //     $scope.cotizacionActual = [];
    //     $scope.listaTemplates = [];
    //     $rootScope.guardarModal = false
    //     $scope.guardar = false;
    //     $scope.templateActual = null;
    //     $scope.templateTemp = null;
    //     $scope.spinner = true;

    // };
    $rootScope.initModal = function() {
        $scope.busquedaActual = [];
        $scope.cotizacionActual = [];
        $scope.listaTemplates = null;
        $rootScope.guardarModal = false
        $scope.guardar = false;
        $scope.templateActual = null;
        $scope.templateTemp = null;
        console.log('logre entrar')
        busquedaRepository.getPlantillas($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
            
            $scope.listaTemplates = result.data
            $scope.templateActual = $scope.listaTemplates[0];

            //$scope.sucursalActual = $scope.sucursales[0];
            // if (!$stateParams.template) {
            //     $scope.templateTemp = $scope.templateActual = $scope.listaTemplates[0];
            // } else {
            //     $scope.listaTemplates.forEach(function(d, n) {
            //         if (d.idCotizacionPlantilla == $stateParams.template) {
            //             $scope.templateTemp = $scope.templateActual = $scope.listaTemplates[n]
            //         }
            //     })
            // }
            $('[data-toggle="tooltip"]').tooltip();

            //Carga refacciones si es edicion de cotizacion

            if ($scope.folioActual != "TEMP") {
                cotizacionesRepository.getCotizacion($scope.folioActual).then(function(result) {
                    $scope.cotizacionActual = result.data;
                    setTimeout(function() {
                        $rootScope.guardarModal = false
                        $scope.guardar = false;
                        $scope.spinner = false;
                        $scope.$apply()
                    }, 10)
                });
            } else {
                $scope.spinner = false;
            }
            //Monitorea cambios en la lista de refacciones actual
            $scope.$watch('cotizacionActual', function(a, b) {
                // $scope.$parent.$parent.total =
                 $rootScope.total = calcularTotal($scope.cotizacionActual)
                if ($scope.cotizacionActual.length > 0) {
                    $rootScope.guardarModal = true
                    $scope.guardar = true;
                } else {
                    $rootScope.guardarModal = false
                    $scope.guardar = false;
                }
            }, true);

        });
    };
    var calcularTotal = function(cotizaciones) {
        var total = 0;
        cotizaciones.forEach(function(data) {
            total += data.PTS_PCOLISTA * data.cantidad;
        })
        return total
    };
    //Limpia busqueda de refacciones
    $scope.clearQuery = function() {
        $scope.refaccionBusqueda = ""
        $scope.busquedaActual = []

    };
    //Agrega una refaccion a la cotizacion actual
    $scope.agregarACotizacion = function(refaccion) {
        var e = true;
        $scope.cotizacionActual.forEach(function(d, n) {
            if (d.PTS_IDPARTE == refaccion.PTS_IDPARTE) {
                $scope.cotizacionActual[n].cantidad += refaccion.cantidad
                e = false;
            }
        })
        if (e) {
            $scope.cotizacionActual.push(refaccion)
            $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual;
        }
        $scope.refaccionBusqueda = ""
        $scope.busquedaActual = []
    };

    //Guarda la cotizacion actual si es nueva, si es edicion guarda los cambios
    $scope.guadarCotizacionBack = function() {
        if ($scope.folioActual == "TEMP") {
            bootbox.prompt({
                title: "Introduce una descripcion a la cotizacion",
                callback: function(result) {
                    if (result != null && result != "") {
                        var cotizacionGuardar = {
                            idUsuario: $scope.Usuario.idUsuario,
                            refacciones: $scope.cotizacionActual,
                            descripcion: result,
                            total: $rootScope.total,
                            empresa: $scope.empresaActual.emp_idempresa, //emp_nombrecto,
                            sucursal: $scope.sucursalActual.AGENCIA, //suc_nombrecto,
                            base: ""
                        }
                        cotizacionesRepository.guardaCotizacion(cotizacionGuardar).then(function(res) {
                            var params = {
                                id: res.data[0].idCotizacion,
                            }
                            if ($scope.templateActual != null) {
                                params.template = $scope.templateActual.idCotizacionPlantilla
                            }
                            //$state.go("user.cotizacion.modal.busqueda", params)
                            $scope.cambioSucursal()
                            toastr.success(res.data[0].mensaje)

                            $rootScope.guardarModal = false
                            $scope.guardar = false;
                        });
                    }
                }
            })
        } else {
            var cotizacionGuardar = {
                idCotizacion: $scope.folioActual,
                refacciones: $scope.cotizacionActual,
                total: $rootScope.total,
            }
            Cotizacion.update(cotizacionGuardar, function(data) {
                $scope.$parent.$parent.$parent.cambioSucursal()
                toastr.success(data.mensaje)
                $rootScope.guardarModal = false
                $scope.guardar = false;
            })
        }
    };

    // Guarda del template si es nuevo, si es edicion guarda los cambios
    $scope.guadarTemplateBack = function() {
        if ($scope.templateActual.idCotizacionPlantilla == 0) {
            bootbox.prompt({
                title: "Introduce un nombre para la nueva plantilla.",
                callback: function(result) {
                    if (result != null && result != "") {
                        var cotizacionGuardar = {
                            idUsuario: $scope.Usuario.idUsuario,
                            idCotizacion: $scope.folioActual,
                            refacciones: $scope.cotizacionActual,
                            descripcion: result,
                            empresa: $scope.empresaActual.emp_idempresa, //emp_nombrecto,
                            sucursal: $scope.sucursalActual.AGENCIA, //suc_nombrecto,
                            base: ""
                        }
                        plantillaRepository.insertPlantilla(cotizacionGuardar).then(function(res) {
                            console.log(res.data)
                            toastr.success(res.data[0].mensaje)
                            $scope.listaTemplates.push({
                                idCotizacionPlantilla: res.data[0].idPlantilla,
                                descripcion: result
                            })
                            $scope.templateActual = $scope.listaTemplates[$scope.listaTemplates.length - 1]
                        });
                        // Template.save(cotizacionGuardar, function(data) {
                        //     console.log(data)
                        //     toastr.success(data.mensaje)
                        //     $scope.listaTemplates.push({
                        //         idCotizacionPlantilla: data.idPlantilla,
                        //         descripcion: result
                        //     })
                        //     $scope.templateActual = $scope.listaTemplates[$scope.listaTemplates.length - 1]
                        // })
                    }
                }
            })
        } else {
            var cotizacionGuardar = {
                idCotizacionPlantilla: $scope.templateActual.idCotizacionPlantilla,
                refacciones: $scope.cotizacionActual,
            }
            plantillaRepository.updatePlantilla(cotizacionGuardar).then(function(result) {
                toastr.success(result.data[0].mensaje)
            });
            // Template.update(cotizacionGuardar, function(data) {
            //     toastr.success(data.mensaje)
            // })
        }
    };

    //Elimina refaccion de la cotizacion actual
    $scope.borrarCotizacion = function(refaccion) {
        $scope.cotizacionActual.forEach(function(d, n) {
            if (d.PTS_IDPARTE == refaccion.PTS_IDPARTE) {
                $scope.cotizacionActual.splice(n, 1);
                $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual
            }
        })
    };
    //Busca listado de refacciones que  coincidan con el termino de busqueda
    $scope.buscarRefaccion = function() {
        // $scope.empresaActual = datosBusqueda.empresa;
        // $scope.sucursalActual = datosBusqueda.sucursal;
        // $scope.folioActual = datosBusqueda.folio;
        if ($scope.refaccionBusqueda.length > 2) {
            busquedaRepository.refacciones($scope.refaccionBusqueda, 'GEN', 'SA', $scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
                result.data.forEach(function(d) {
                    d.cantidad = 1;
                })
                $scope.busquedaActual = result.data;
            });
        } else {
            $scope.busquedaActual = []
        }
    };
    //Carga las refacciones desde un template
    $scope.cargarTemplate = function() {
        if ($scope.cotizacionActual.length > 0) {
            bootbox.confirm("<h4>Al cargar una plantilla, se perderan los cambios no guardados de la cotizacion actua. ¿Desea continuar?</h4>",
                function(result) {
                    if (result) {
                        $scope.templateTemp = $scope.templateActual
                        busquedaRepository.getInfoPlantilla($scope.templateActual.idCotizacionPlantilla).then(function(result) {
                            $scope.cotizacionActual = result.data;
                            $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual
                            toastr.info("Se cargo la plantilla correctamente.")
                        });
                    } else {
                        $scope.listaTemplates.forEach(function(e, n) {
                            if ($scope.templateTemp.idCotizacionPlantilla == e.idCotizacionPlantilla) {
                                $scope.templateActual = $scope.listaTemplates[n];
                                $scope.$apply($scope.templateActual)
                            }
                        })
                    }
                })
        } else {
            $scope.templateTemp = $scope.templateActual
            busquedaRepository.getInfoPlantilla($scope.templateActual.idCotizacionPlantilla).then(function(result) {
                $scope.cotizacionActual = result.data;
                $scope.$parent.$parent.cotizacionActual = $scope.cotizacionActual
                toastr.info("Se cargo la plantilla correctamente.")
            });
        }
    };

    //Eliminar plantilla
    $scope.eliminarTemplate = function() {
        bootbox.confirm("<h4>El borrado de la plantilla no afecta su cotizacion actual. ¿Desea continuar con el borrado?</h4>",
            function(result) {
                if (result) {
                    plantillaRepository.deletePlantilla($scope.templateActual.idCotizacionPlantilla).then(function(res) {
                        $scope.listaTemplates.forEach(function(e, n) {
                            if ($scope.templateActual.idCotizacionPlantilla == e.idCotizacionPlantilla) {
                                $scope.listaTemplates.splice(n, 1);
                                $scope.templateActual = $scope.listaTemplates[0];
                                toastr.info("Se elimino la plantilla correctamente.")
                            }
                        })
                        console.log(res.data[0].mensaje, 'Soy el mensaje al eliminar la plantilla')
                    });
                }
            })
    };
});