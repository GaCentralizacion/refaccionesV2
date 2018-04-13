registrationModule.controller('operadorController', function($sce, $http, $scope, $rootScope, $location, $timeout, alertFactory, operadorRepository, filterFactory, userFactory, globalFactory, direccionRepository) {


    $scope.listOperadores = [];
    $scope.bloquea = false;
    $scope.add = false;
    $scope.tipo = 1;
    $scope.texto = "";

    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        $scope.existeColonia = '';
        console.log($scope.vigencia, 'Soy la vigencia');
        $scope.existeColonia = '';
    };


    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {

                $scope.empresas = result.data;
                $scope.empresaActual = $scope.empresas[0];

                //SET EMPRESA LOCALSTORAGE   BEGIN
                if (localStorage.getItem('localEmpresa') !== null) {

                    $scope.localEmpresa = []

                    $scope.tempEmp = localStorage.getItem('localEmpresa')
                    $scope.localEmpresa.push(JSON.parse($scope.tempEmp))
                    setTimeout(function() {

                        $("#selEmpresas").val($scope.localEmpresa[0][0].emp_idempresa);
                        $scope.empresaActual = $scope.localEmpresa[0][0]; //$scope.empresas;

                        $scope.consultaSucursales();
                    }, 100);

                }
                //SET EMPRESA LOCALSTORAGE   END

            } else {
                alertFactory.success('No se encontraron empresas');
            }
        });

    };


    $scope.operador = function(tipo) {
        if ($scope.calle == '' || $scope.calle == undefined || $scope.calle == null) $scope.calle = ' ';
        if ($scope.exterior == '' || $scope.exterior == undefined || $scope.exterior == null) $scope.exterior = ' ';
        if ($scope.interior == '' || $scope.interior == undefined || $scope.interior == null) $scope.interior = ' ';
        if ($scope.coloniaActual.colonia == '' || $scope.coloniaActual.colonia == undefined || $scope.coloniaActual.colonia == null || $scope.coloniaActual.idColonia == 0) $scope.coloniaActual.colonia = ' ';
        if ($scope.municipioActual.municipio == '' || $scope.municipioActual.municipio == undefined || $scope.municipioActual.municipio == null || $scope.municipioActual.idMunicipio == 0) $scope.municipioActual.municipio = ' ';
        if ($scope.ciudadActual.d_ciudad == '' || $scope.ciudadActual.d_ciudad == undefined || $scope.ciudadActual.d_ciudad == null || $scope.ciudadActual.idCiudad == 0) $scope.ciudadActual.d_ciudad = ' ';
        if ($scope.estadoActual.descripcion == '' || $scope.estadoActual.descripcion == undefined || $scope.estadoActual.descripcion == null || $scope.estadoActual.idEdo == 0) $scope.estadoActual.descripcion = ' ';
        if ($scope.rfc == '' || $scope.rfc == undefined || $scope.rfc == null) $scope.rfc = ' ';
        $('#modalAddOperador').modal('hide');

        new Promise(function(resolve, reject) {

            if ($scope.bloquea == false) $scope.cadenaConfirma = "Está a punto de confirmar el operador con la siguiente información: <br/><br/>" +
                " <dl class='dl-horizontal'> " +
                "     <dt>Nombre:</dt> " +
                "     <dd> " + $scope.nombre + " " + $scope.apPaterno + " " + $scope.apMaterno + " </dd> " +
                "     <dt>Domicilio:</dt> " +
                "     <dd> " + $scope.calle + ' ' + $scope.exterior + ' ' + $scope.interior + ' ' + $scope.coloniaActual.colonia + ' ' + $scope.municipioActual.municipio + ' ' + $scope.ciudadActual.d_ciudad + ' ' + $scope.estadoActual.descripcion + ' ' + $scope.cpActual + " </dd> " +
                "     <dt>R.F.C.:</dt> " +
                "     <dd> " + $scope.rfc + " </dd> " +
                "     <dt>Teléfono:</dt> " +
                "     <dd> " + $scope.telefono + " </dd> " +
                "     <dt>Número de Licencia:</dt> " +
                "     <dd> " + $scope.numeroLicencia + " </dd> " +
                "     <dt>Vigencia:</dt> " +
                "     <dd> " + $scope.vigencia + " </dd> " +
                " </dl> " +
                "";
            //"<h4>Está a punto de confirmar  al operador <br/>" + $scope.nombre + " " + $scope.apPaterno + " " + $scope.apMaterno + "<br> con el telefono " + $scope.telefono + " ¿Desea continuar?</h4>"
            else $scope.cadenaConfirma = "<h4>Está a punto de eliminar al operador " + $scope.nombre + " " + $scope.apPaterno + " " + $scope.apMaterno + "¿Desea continuar?</h4>"

            bootbox.confirm({
                title: "¿Desea continuar?",
                message: $scope.cadenaConfirma,
                size: 'large',
                buttons: {
                    confirm: {
                        label: 'Sí',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: function(result) {
                    if (result) resolve(1)
                    else {
                        reject(2);
                        $('#modalAddOperador').modal('show');
                    }
                }
            })
        }).then(function(operacion) {
            new Promise(function(resolve, reject) {
                if ($scope.bloquea == true) $scope.tipo = 0;
                if ($scope.bloquea == false) $scope.tipo = 1;
                var fechaInicio = $scope.vigencia.split('/');
                var fechaVigencia = fechaInicio[2] + '/' + fechaInicio[1] + '/' + fechaInicio[0];
                console.log(fechaVigencia, 'TOMATELA')
                var datos = {
                    nombre: $scope.nombre,
                    apPaterno: $scope.apPaterno,
                    apMaterno: $scope.apMaterno,
                    calle: $scope.calle,
                    exterior: $scope.exterior,
                    interior: $scope.interior,
                    colonia: $scope.coloniaActual.colonia,
                    municipio: $scope.municipioActual.municipio,
                    ciudad: $scope.ciudadActual.d_ciudad,
                    estado: $scope.estadoActual.descripcion,
                    cp: $scope.cpActual,
                    rfc: $scope.rfc,
                    telefono: $scope.telefono,
                    numeroLicencia: $scope.numeroLicencia,
                    vigencia: fechaVigencia,
                    idEmpresa: $scope.empresaActual.emp_idempresa,
                    idUsuario: $scope.Usuario.idUsuario,
                    idSucursal: $scope.sucursalActual.AGENCIA
                };
                console.log(datos, 'HOLIS')
                if ($scope.add == true) {
                    operadorRepository.postCreate(datos).then(function(result) {
                        // $scope.limpaValores();
                        resolve(result.data);
                    });
                } else {
                    datos.idOperador = $scope.idOperador;
                    datos.estatus = $scope.tipo;
                    operadorRepository.postUpdate(datos).then(function(result) {
                        //    $scope.limpaValores();
                        resolve(result.data);
                    });
                }


            }).then(function(respuesta) {

                if (respuesta.estatus = 'ok') {
                    $scope.cambioEmpresa();
                    bootbox.alert({
                        title: 'Operacion realizada!!.',
                        message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddOperador').modal('hide')
                            $scope.cambioSucursal()
                            //$state.go("user.aprobacion")
                        }
                    });
                    // bootbox.alert("<h4> Operacion realizada!!. </h4>",
                    //     function() {
                    //         $('#modalAddOperador').modal('hide')
                    //     });

                } else { //error al guardar 
                    bootbox.alert({
                        title: respuesta.mensaje,
                        message: '<div class="col-sm-12 text-center"><div class="iconoError"><i class="fa fa-close icon-circle icon-3x"></i></div></div>',
                        size: 'large',
                        callback: function() {
                            $('#modalAddOperador').modal('hide')
                            $scope.cambioSucursal()
                            //$state.go("user.aprobacion")
                        }
                    });
                    // bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                    //     function() {
                    //         $('#modalAddOperador').modal('hide')
                    //         //$state.go("user.aprobacion")
                    //     });
                    // bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                    //     function() {
                    //         $('#modalAddOperador').modal('hide')
                    //         //$state.go("user.aprobacion")
                    //     });
                }


            });

        }); //fin promise     

    };



    $scope.modalOperador = function(operador, tipo) {

        $scope.limpaValores();

        $('#modalAddOperador').modal('show');

        if (tipo == 1) {
            $scope.add = true;
            $scope.bloquea = false;
            $scope.texto = "Guardar ";
        }
        if (tipo == 2) {
            $scope.add = false;
            $scope.bloquea = false;
            $scope.texto = "Actualizar ";
        } else if (tipo == 3) {
            $scope.add = false;
            $scope.bloquea = true;
            $scope.texto = "Eliminar ";
        }
        if (operador != null && operador != true) {
            var fecha = new Date(operador.vigencia)
            //console.log(fecha,'La que llega de bd')
            $scope.existeColonia = operador.colonia;
            $scope.idOperador = operador.idOperador;
            $scope.nombre = operador.nombre;
            $scope.apPaterno = operador.apellidoPaterno;
            $scope.apMaterno = operador.apellidoMaterno;
            $scope.rfc = operador.rfc;
            $scope.telefono = operador.telefono;
            $scope.numeroLicencia = operador.numeroLicencia;
            $scope.vigencia = operador.vigencia;
            $scope.calle = operador.calle;
            $scope.exterior = operador.numExterior;
            $scope.interior = operador.numInterior;
            $scope.cpActual = operador.cp.toString();
            console.log($scope.cpActual.length, 'PORFA')
            if ($scope.cpActual.length == 4) $scope.cpActual = '0' + $scope.cpActual;
            if ($scope.cpActual.length == 5) {
                $scope.buscarCP();
            }
            // if($scope.cpActual.length)
            // $scope.coloniaActual.colonia = operador.;
            // $scope.municipioActual.municipio = operador.;
            // $scope.ciudadActual.d_ciudad = operador.;
            // $scope.estadoActual.descripcion = operador.;


        }
    };

    // $scope.cambioEmpresa = function() {
    //     $('#tblOperadores').DataTable().destroy();
    //     $scope.listOperadores = [];
    //     if ($scope.empresaActual.emp_idempresa != 0) {
    //         operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result) {
    //             if (result.data.length > 0) {
    //                 $scope.listOperadores = result.data;
    //                 setTimeout(function() {
    //                     $scope.setTablePaging('tblOperadores');

    //                     $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
    //                     $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");

    //                 }, 1);
    //                 $scope.consultaEstado();
    //             } else {
    //                 alertFactory.info("No se encontraron resultados !!");
    //                 $scope.listOperadores = [];
    //             }
    //         });
    //     } else { $scope.listOperadores = []; }
    // };
    $scope.cambioEmpresa = function() {
        if ($scope.empresaActual.emp_idempresa != 0) {
            $scope.localEmpresa = []
            $scope.localEmpresa.push({
                emp_idempresa: $scope.empresaActual.emp_idempresa,
                emp_nombre: $scope.empresaActual.emp_nombre,
                emp_nombrecto: $scope.empresaActual.emp_nombrecto
            })
            //$scope.histEmpresa.push($scope.empresaActual);
            localStorage.setItem('localEmpresa', JSON.stringify($scope.localEmpresa));


            $scope.consultaSucursales();

        } else {
            $scope.sucursales = $scope.sucursalActual = null;
            localStorage.removeItem('localEmpresa')
            localStorage.removeItem('cotSucursal')
        }
    };


    $scope.consultaSucursales = function() {

        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.Usuario.rol).then(function(result) {
            $scope.sucursales = result.data;
            $scope.sucursalActual = $scope.sucursales[0];


            //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
            if (localStorage.getItem('localSucursal') !== null) {

                console.log('existe sucursal cotizacion')

                $scope.localSucursal = []

                //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                $scope.tempSuc = localStorage.getItem('localSucursal')
                $scope.localSucursal.push(JSON.parse($scope.tempSuc))

                console.log($scope.localSucursal)

                setTimeout(function() {

                    console.log('poniendo sucursal en cotizacion')
                    $("#selSucursales").val($scope.localSucursal[0][0].AGENCIA);
                    $scope.sucursalActual = $scope.localSucursal[0][0]; //$scope.empresas;

                    //$scope.consultaCotizaciones();
                    $scope.cambioSucursal();

                }, 10);

            } //SET SUCURSAL DESDE LOCALSTORAGE  END
        });
        // })
    };

    $scope.cambioSucursal = function(empresa, sucursal, fecha) {
        $scope.mostrarFormulario = true;
        // var datos = {
        //     idUsuario: $scope.Usuario.idUsuario,
        //     idEmpresa: $scope.empresaActual.emp_idempresa,
        //     idSucursal: $scope.sucursalActual.AGENCIA,
        //     opcion: 2,
        //     idEstatus: 1,
        //     role: $scope.Usuario.rol
        // }
        operadorRepository.getOperadores($scope.empresaActual.emp_idempresa, $scope.sucursalActual.AGENCIA).then(function(result) {
            if (result.data.length > 0) {
                $scope.listOperadores = result.data;
                $('#tblOperadores').DataTable().destroy();
                setTimeout(function() {
                    $scope.setTablePaging('tblOperadores');

                    $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
                    $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");

                }, 1);
                // LOCALSTORAGE SUCURSAL
                if ($scope.sucursalActual.AGENCIA != 0) {

                    //console.log($scope.sucursalActual)

                    $scope.localSucursal = []

                    $scope.localSucursal.push({
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
                    localStorage.setItem('localSucursal', JSON.stringify($scope.localSucursal));
                } else {
                    localStorage.removeItem('localSucursal')
                }
                // LOCALSTORAGE SUCURSAL
                $scope.consultaEstado();
            } else {
                alertFactory.info("No se encontraron resultados !!");
                $scope.listOperadores = [];
            }
        });

    };

    $scope.limpaValores = function() {
        // $scope.tipo = 1;
        // $scope.bloquea = false;
        // $scope.add = false;
        $scope.estadoActual = [];
        $scope.ciudadActual = [];
        $scope.municipioActual = [];
        $scope.coloniaActual = [];
        $scope.estadoActual.idEdo = 0;
        $scope.ciudadActual.idCiudad = 0;
        $scope.municipioActual.idMunicipio = 0;
        $scope.coloniaActual.idColonia = 0;
        $scope.rfc = '';
        $scope.telefono = '';
        $scope.numeroLicencia = '';
        $scope.vigencia = '';
        $scope.calle = '';
        $scope.exterior = '';
        $scope.interior = '';
        $scope.coloniaActual.colonia = '';
        $scope.municipioActual.municipio = '';
        $scope.ciudadActual.d_ciudad = '';
        $scope.estadoActual.descripcion = '';
        $scope.cpActual = '';
        $scope.nombre = '';
        $scope.apPaterno = '';
        $scope.apMaterno = '';
        //$scope.consultaEstado();
        $scope.clearEstado();

    };
    $scope.salir = function() {
        $('#modalAddOperador').modal('hide');

    };



    $scope.setTablePaging = function(idTable) {
        $('#' + idTable).DataTable().destroy();
        $('#' + idTable + ' thead th').each(function() {
            var titulo = $(this).text()
            $(this).html(titulo + '<br><input type="text" class="filtro-tabla"/>')
        })
        setTimeout(function() {
            var table = $('#' + idTable).DataTable({
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
            table.columns().every(function() {
                var that = this

                $('input', this.header()).on('keyup change', function() {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw()
                    }
                })
            })
        }, 100);
    }; //end setTablePaging

    $scope.consultaEstado = function() {

        var datos = {
            user: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA
        };

        direccionRepository.getEstado(datos).then(function(result) {
            $scope.Estados = result.data;
            $scope.Estados.unshift({ idEdo: "0", descripcion: "Seleccioné ..." });
            $scope.estadoActual = $scope.Estados[0];

        });
    };
    $scope.cambioEstado = function() {
        $scope.clearEstado();
        $scope.consultaCiudad();

    };
    //Limpia busqueda Estado
    $scope.clearEstado = function() {
        $scope.cpActual = "";
        $scope.busquedaActual = [];
        $scope.ciudadActual = [];
        $scope.municipioActual = [];
        $scope.coloniaActual = [];
    };
    $scope.consultaCiudad = function(direccion) {

        var datos = {
            user: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA,
            estado: $scope.estadoActual.descripcion
        };
        //$scope.$apply();
        direccionRepository.getCiudad(datos).then(function(result) {
            $scope.Ciudades = result.data;
            $scope.Ciudades.unshift({ idCiudad: "0", d_ciudad: "Seleccioné ..." });
            $scope.ciudadActual = $scope.Ciudades[0];
            if (direccion != undefined && direccion != '') {
                $scope.ciudadActual = $scope.Ciudades.find(checaCiudad);
                $scope.consultaMunicipio(direccion.D_mnpio);

                function checaCiudad(dir) {
                    return dir.d_ciudad == direccion.d_ciudad;
                };
            }

        });

    };
    //Limpia busqueda Ciudad
    $scope.clearCiudad = function() {
        $scope.cpActual = "";
        $scope.busquedaActual = [];
        $scope.municipioActual = [];
        $scope.coloniaActual = [];
    };


    $scope.cambioCiudad = function() {
        $scope.clearCiudad();
        $scope.consultaMunicipio();

    };




    $scope.consultaMunicipio = function(municipio) {

        var datos = {
            user: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA,
            estado: $scope.estadoActual.descripcion,
            ciudad: $scope.ciudadActual.d_ciudad
        };

        direccionRepository.getMunicipio(datos).then(function(result) {

            $scope.Municipios = result.data;
            $scope.Municipios.unshift({ idMunicipio: "0", municipio: "Seleccioné ..." });
            $scope.municipioActual = $scope.Municipios[0];
            if (municipio != undefined && municipio != '') {
                $scope.municipioActual = $scope.Municipios.find(checaMunicipio);
                $scope.consultaColonia(1);

                function checaMunicipio(dir) {
                    return dir.municipio == municipio;
                };
            }
        });
    };

    $scope.cambioMunicipio = function() {

        $scope.consultaColonia();

    };



    $scope.consultaColonia = function(consulta) {
        if (consulta == 1) {
            cp = $scope.cpActual;
        } else {
            cp = '';
        }

        var datos = {
            user: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA,
            estado: $scope.estadoActual.descripcion,
            ciudad: $scope.ciudadActual.d_ciudad,
            municipio: $scope.municipioActual.municipio,
            cp: cp
        };

        direccionRepository.getColonia(datos).then(function(result) {
            $scope.Colonias = result.data;
            $scope.Colonias.unshift({ idColonia: "0", colonia: "Seleccioné ..." });
            $scope.coloniaActual = $scope.Colonias[0];
            if ($scope.existeColonia != '' && $scope.existeColonia != undefined && $scope.existeColonia != null) {
                $scope.coloniaActual = $scope.Colonias.find(checaColonia);

                function checaColonia(dir) {
                    return dir.colonia == $scope.existeColonia;
                };
            }
        });


    };

    $scope.cambioColonia = function() {

        $scope.consultaCp();

    };
    //Busca listado de Codigos Postales
    $scope.buscarCP = function() {
        if ($scope.cpActual.length == 5) {
            $scope.cambioCp();
        } else if ($scope.cpActual.length < 5) {
            $scope.busquedaActual = [];
            $scope.ciudadActual = [];
            $scope.municipioActual = [];
            $scope.coloniaActual = [];
            $scope.estadoActual = $scope.Estados[0];
        }
        if ($scope.cpActual.length > 2) {
            var datos = {
                cp: $scope.cpActual,
                idEmpresa: $scope.empresaActual.emp_idempresa,
                idSucursal: $scope.sucursalActual.AGENCIA
            };
            direccionRepository.getListCp(datos).then(function(result) {
                $scope.busquedaActual = result.data;
            });
        } else {
            $scope.busquedaActual = []
        }
    };
    //Limpia busqueda de Codigo Postal
    $scope.clearQuery = function() {
        $scope.cpActual = "";
        $scope.busquedaActual = [];
        $scope.ciudadActual = [];
        $scope.municipioActual = [];
        $scope.coloniaActual = [];
        $scope.estadoActual = $scope.Estados[0];
    };
    $scope.seleccionCp = function(cp) {
        $scope.cpActual = cp;
        $scope.busquedaActual = [];
        $scope.cambioCp();
    };
    $scope.consultaCp = function() {
        var datos = null;
        datos = {
            user: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA,
            estado: $scope.estadoActual.descripcion,
            ciudad: $scope.ciudadActual.d_ciudad,
            municipio: $scope.municipioActual.municipio,
            colonia: $scope.coloniaActual.colonia
        };
        direccionRepository.getCp(datos).then(function(result) {
            $scope.cpActual = result.data[0].cp;
        });
    };
    $scope.cambioCp = function() {
        var datos = {
            cp: $scope.cpActual,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA
        };
        console.log($scope.cpActual, 'SOY EL CP')
        direccionRepository.getInformacionCp(datos).then(function(result) {
            console.log(result.data, 'Soy el cp relacionado al CP');

            function checaEstado(direccion) {
                return direccion.descripcion == result.data[0].d_estado;
            };

            $scope.estadoActual = $scope.Estados.find(checaEstado);
            $scope.consultaCiudad(result.data[0]);
            //$scope.ciudadActual = $scope.Ciudades.find(checaCiudad);




        });
    };


});