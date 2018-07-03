registrationModule.controller('direccionesController', function($sce, $scope, $rootScope, $location, $timeout, alertFactory, filterFactory, userFactory, globalFactory, direccionRepository) {



    $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        // $scope.verTabD = false;
        // $scope.verTabP = true;
        $scope.mostrarGuardar = true;
        $scope.mostrarActualizar = false;
        // $scope.actD = 'active';
        $scope.mostrarFormulario = false;
        $scope.existeColonia = '';

    };

    $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, $scope.Usuario.rol).then(function(result) {
            if (result.data.length > 0) {
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

                        $scope.consultaSucursales();
                    }, 100);

                }
                //SET EMPRESA LOCALSTORAGE   END
            } else {
                alertFactory.success('No se encontraron empresas');
                localStorage.removeItem('pedEmpresa')
                localStorage.removeItem('pedSucursal')
            }

        });
    };


    $scope.cambioEmpresa = function() {
        if ($scope.empresaActual.emp_idempresa != 0) {

            //$scope.histEmpresa = []
            console.log('empresa actual')
            console.log($scope.empresaActual)
            $scope.pedEmpresa = []

            $scope.pedEmpresa.push({
                emp_idempresa: $scope.empresaActual.emp_idempresa,
                emp_nombre: $scope.empresaActual.emp_nombre,
                emp_nombrecto: $scope.empresaActual.emp_nombrecto
            })
            //$scope.histEmpresa.push($scope.empresaActual);
            localStorage.setItem('pedEmpresa', JSON.stringify($scope.pedEmpresa));


            $scope.consultaSucursales();

        } else {

        }
    };


    $scope.consultaSucursales = function() {

        filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, $scope.Usuario.rol).then(function(result) {
            $scope.sucursales = result.data;
            $scope.sucursalActual = $scope.sucursales[0];


            //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
            if (localStorage.getItem('histSucursal') !== null) {

                $scope.histSucursal = []

                //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                $scope.tempHistSuc = localStorage.getItem('histSucursal')
                $scope.histSucursal.push(JSON.parse($scope.tempHistSuc))
                //$scope.consultaEstado();
                setTimeout(function() {

                    $("#selSucursales").val($scope.histSucursal[0][0].AGENCIA);
                    $scope.sucursalActual = $scope.histSucursal[0][0]; //$scope.empresas;                            
                    $scope.consultaEstado();
                    $scope.cambioSucursal();
                }, 100);

            } //SET SUCURSAL DESDE LOCALSTORAGE   END
        });
        // })
    };

    $scope.cambioSucursal = function(empresa, sucursal, fecha) {
        $scope.mostrarFormulario = true;
        var datos = {
            idUsuario: $scope.Usuario.idUsuario,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA,
            opcion: 2,
            idEstatus: 1,
            role: $scope.Usuario.rol
        }
        direccionRepository.getDirecciones(datos).then(function(result) {
            $('#tblDireccionFiltros').DataTable().destroy();
            $scope.listaDirecciones = result.data;



            setTimeout(function() {
                $scope.setTablePaging('tblDireccionFiltros');
                console.log($scope.listaDirecciones);


                $("#tblDireccionFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblDireccionFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

            }, 1);

            $scope.consultaEstado();
            $scope.estadoActual = [];
            $scope.ciudadActual = [];
            $scope.municipioActual = [];
            $scope.coloniaActual = [];
            $scope.estadoActual.idEdo = 0;
            $scope.ciudadActual.idCiudad = 0;
            $scope.municipioActual.idMunicipio = 0;
            $scope.coloniaActual.idColonia = 0
            //$scope.consultaCp();
        });

    };

    $scope.verDetalleDireccion = function(direccion) {
        $scope.direccion = direccion;
        $('#modal-direccion').modal('show');
    };

    $scope.verTabs = function(tipo, direccion) {
        if (tipo == 1) {
            // $scope.verTabP = true;
            // $scope.verTabD = false;
            // $scope.actD = 'active';
            // $scope.actP = '';
            $('#modalAltaDirecciones').modal('show')
            $scope.mostrarGuardar = true;
            $scope.mostrarActualizar = false;
            $scope.clearFormulario();
            $scope.clearQuery();
            if (direccion != undefined && direccion != '') {
                $scope.idDireccion = direccion.idDireccion;
                $scope.existeColonia = direccion.RTD_COLONIA;
                $scope.mostrarGuardar = false;
                $scope.mostrarActualizar = true;
                $scope.calle = direccion.RTD_CALLE1;
                $scope.exterior = direccion.RTD_NUMEXTER;
                $scope.interior = direccion.RTD_NUMINER;
                $scope.referencia = direccion.RTD_OBSERVACIONES
                // Contacto 1
                $scope.nombre1 = direccion.RTD_NOMPER1;
                $scope.apaterno1 = direccion.RTD_PATPER1;
                $scope.amaterno1 = direccion.RTD_MATPER1;
                $scope.rfc1 = direccion.RTD_RFCPER1;
                $scope.lada1 = direccion.RTD_LADAPER1;
                $scope.tel1_1 = direccion.RTD_TEL1PER1;
                $scope.tel2_1 = direccion.RTD_TEL2PER1;
                $scope.correo1 = direccion.RTD_EMAILPER1;
                // Contacto 2
                $scope.nombre2 = direccion.RTD_NOMPER2;
                $scope.apaterno2 = direccion.RTD_PATPER2;
                $scope.amaterno2 = direccion.RTD_MATPER2;
                $scope.rfc2 = direccion.RTD_RFCPER2;
                $scope.lada2 = direccion.RTD_LADAPER2;
                $scope.tel1_2 = direccion.RTD_TEL1PER2;
                $scope.tel2_2 = direccion.RTD_TEL2PER2;
                $scope.correo2 = direccion.RTD_EMAILPER2;
                $scope.correoGeneral = direccion.RTD_EMAILGENERAL;
                $scope.seleccionCp(direccion.RTD_CODPOS);

                console.log('SOY LA DIRECCION', direccion)
            }
        } else {
            // $scope.verTabP = false;
            // $scope.verTabD = true;
            // $scope.actP = 'active';
            // $scope.actD = '';
        }
    };
    $scope.clearFormulario = function() {
        $scope.calle = null;
        $scope.exterior = null;
        $scope.interior = null;
        $scope.referencia = null;
        // Contacto 1
        $scope.nombre1 = null;
        $scope.apaterno1 = null;
        $scope.amaterno1 = null;
        $scope.rfc1 = null;
        $scope.lada1 = null;
        $scope.tel1_1 = null;
        $scope.tel2_1 = null;
        $scope.correo1 = null;
        // Contacto 2
        $scope.nombre2 = null;
        $scope.apaterno2 = null;
        $scope.amaterno2 = null;
        $scope.rfc2 = null;
        $scope.lada2 = null;
        $scope.tel1_2 = null;
        $scope.tel2_2 = null;
        $scope.correo2 = null;
        $scope.correoGeneral = null;
    }

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
        // $scope.municipioActual = [];
        // $scope.coloniaActual = [];
        // $scope.Codigos = [];
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

        direccionRepository.getCiudad(datos).then(function(result) {
            $scope.Ciudades = result.data;
            $scope.Ciudades.unshift({ idCiudad: "0", d_ciudad: "Seleccioné ..." });
            //$scope.Ciudades.unshift({ d_ciudad: "Seleccioné ..." });
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
            //$scope.Municipios.unshift({ municipio: "Seleccioné ..." });
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
            //$scope.Colonias.unshift({ colonia: "Seleccioné ..." });
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

    // $scope.consultaCp = function() {
    //     var datos = null;
    //     if ($scope.estadoActual.idEdo == 0) {
    //         $scope.estadoActual.descripcion = '';
    //     }
    //     if ($scope.ciudadActual.idCiudad == 0) {
    //         $scope.ciudadActual.d_ciudad = '';
    //     }
    //     if ($scope.municipioActual.idMunicipio == 0) {
    //         $scope.municipioActual.municipio = '';
    //     }
    //     if ($scope.coloniaActual.idColonia == 0) {
    //         $scope.coloniaActual.colonia = '';
    //     }

    //     datos = {
    //         user: $scope.Usuario.idUsuario,
    //         idEmpresa: $scope.empresaActual.emp_idempresa,
    //         idSucursal: $scope.sucursalActual.AGENCIA,
    //         estado: $scope.estadoActual.descripcion,
    //         ciudad: $scope.ciudadActual.d_ciudad,
    //         municipio: $scope.municipioActual.municipio,
    //         colonia: $scope.coloniaActual.colonia
    //     };
    //     direccionRepository.getCp(datos).then(function(result) {
    //         $scope.Codigos = result.data;
    //         $scope.Codigos.unshift({ cp: "Seleccioné ..." });
    //         if ($scope.Codigos.length == 2) {
    //             $scope.cpActual = $scope.Codigos[1];
    //         } else {
    //             $scope.cpActual = $scope.Codigos[0];
    //         }
    //     });
    // };


    $scope.cambioCp = function() {
        var datos = {
            cp: $scope.cpActual,
            idEmpresa: $scope.empresaActual.emp_idempresa,
            idSucursal: $scope.sucursalActual.AGENCIA
        };
        console.log($scope.cpActual, 'SOY EL CP')
        direccionRepository.getInformacionCp(datos).then(function(result) {
            console.log(result.data, 'Soy el cp relacionado al CP');
            $scope.estadoActual = $scope.Estados.find(checaEstado);
            $scope.consultaCiudad(result.data[0]);
            //$scope.ciudadActual = $scope.Ciudades.find(checaCiudad);


            function checaEstado(direccion) {
                return direccion.descripcion == result.data[0].d_estado;
            };


        });
    };


    $scope.guardaDireccion = function() {
        if ($scope.estadoActual.idEdo == $scope.Estados[0].idEdo) {
            $scope.mensajeEstado = true;

        } else {
            new Promise(function(resolve, reject) {


                bootbox.confirm({
                    title: "Está a punto de registrar esta dirección",
                    message: "¿Desea continuar?",
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
                        if (result)
                            resolve(1)
                        else
                            reject(2)
                    }
                })
                // $scope.cadenaConfirma = "<h4>Está a punto de registrar esta dirección ¿Desea continuar?</h4>"
                // bootbox.confirm($scope.cadenaConfirma,
                //     function(result) {
                //         if (result)
                //             resolve(1)
                //         else
                //             reject(2)
                //     }
                // )
            }).then(function(operacion) {

                console.log('archivo:')
                console.log($scope.archivoComprobante)

                //var files = $('#avatar').prop("files"); //$(ele).get(0).files;
                var files = $('#file-5').prop("files"); //$(ele).get(0).files;
                $scope.comprobante = 0;

                if (files.length > 0)
                    $scope.comprobante = 1;

                new Promise(function(resolve, reject) {
                    var datos = {
                        idUsuario: $scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal: $scope.sucursalActual.AGENCIA,
                        estado: $scope.estadoActual.idEdo,
                        ciudad: $scope.ciudadActual.d_ciudad,
                        municipio: $scope.municipioActual.municipio,
                        colonia: $scope.coloniaActual.colonia,
                        cp: $scope.cpActual,
                        calle: $scope.calle,
                        exterior: $scope.exterior,
                        interior: $scope.interior,
                        referencia: $scope.referencia,
                        nombre1: $scope.nombre1,
                        apaterno1: $scope.apaterno1,
                        amaterno1: $scope.amaterno1,
                        rfc1: $scope.rfc1,
                        lada1: $scope.lada1,
                        tel1_1: $scope.tel1_1,
                        tel2_1: $scope.tel2_1,
                        correo1: $scope.correo1,
                        nombre2: $scope.nombre2,
                        apaterno2: $scope.apaterno2,
                        amaterno2: $scope.amaterno2,
                        rfc2: $scope.rfc2,
                        lada2: $scope.lada2,
                        tel1_2: $scope.tel1_2,
                        tel2_2: $scope.tel2_2,
                        correo2: $scope.correo2,
                        correoGeneral: $scope.correoGeneral,
                        archivo: $scope.archivoComprobante,
                        comprobante: $scope.comprobante
                    };

                    direccionRepository.postCreate(datos).then(function(result) {

                        $scope.empresaActual = $scope.empresas[0];
                        $scope.sucursalActual = {};
                        $scope.estadoActual = {};
                        $scope.ciudadActual = {};
                        $scope.municipioActual = {};
                        $scope.coloniaActual = {};
                        $scope.cpActual = '';

                        $scope.calle = '';
                        $scope.exterior = '';
                        $scope.interior = '';
                        $scope.referencia = '';

                        $scope.nombre1 = '';
                        $scope.apaterno1 = '';
                        $scope.amaterno1 = '';
                        $scope.rfc1 = '';
                        $scope.lada1 = '';
                        $scope.tel1_1 = '';
                        $scope.tel2_1 = '';
                        $scope.correo1 = '';

                        $scope.nombre2 = '';
                        $scope.apaterno2 = '';
                        $scope.amaterno2 = '';
                        $scope.rfc2 = '';
                        $scope.lada2 = '';
                        $scope.tel1_2 = '';
                        $scope.tel2_2 = '';
                        $scope.correo2 = '';
                        $scope.correoGeneral = '';
                        resolve(result.data);
                    });

                }).then(function(respuesta) {

                    if (respuesta.estatus = 'ok') {
                        // $scope.guardarArchivo(respuesta.idDireccion, $scope.user.per_idpersona);

                        bootbox.alert("<h4> Dirección guardada exitosamente. </h4>",
                            function() {
                                $('.modal-aprobacion').modal('hide')
                                $('#modalAltaDirecciones').modal('hide')
                            });
                        $scope.init();

                    } //if respuesta.estatus = 0k
                    else { //error al guardar

                        console.log('error al guardar')

                        bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                            function() {
                                $('.modal-aprobacion').modal('hide')
                                $('#modalAltaDirecciones').modal('hide')
                                //$state.go("user.aprobacion")
                            });
                    }

                });

            }); //fin promise  

        }



    }; // fin guarda direccion


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
    $scope.nuevaDireccion = function() {
        $scope.clearFormulario();
        $scope.clearQuery();
        $scope.mostrarGuardar = true;
        $scope.mostrarActualizar = false;
        $('#modalAltaDirecciones').modal('show')
    };


    //     // Actualiza la dirección  actualizaDireccion
    $scope.actualizaDireccion = function(direccion) {
        if ($scope.estadoActual.idEdo == $scope.Estados[0].idEdo) {
            $scope.mensajeEstado = true;

        } else {
            new Promise(function(resolve, reject) {
                $('#modalAltaDirecciones').modal('hide')
                /*
                estado: $scope.estadoActual.idEdo,
                        ciudad: $scope.ciudadActual.d_ciudad,
                        municipio: $scope.municipioActual.municipio,
                        colonia: $scope.coloniaActual.colonia,
                        cp: $scope.cpActual,
                        calle: $scope.calle,
                        exterior: $scope.exterior,
                        interior: $scope.interior,
                */
                // map = new google.maps.Map(document.getElementById('map'), {
                //     center: { lat: -34.397, lng: 150.644 },
                //     zoom: 8
                // });
                $scope.direccionPre = $scope.calle.toUpperCase() + ', ' + $scope.coloniaActual.colonia.toUpperCase() + ', ' + $scope.municipioActual.municipio.toUpperCase() + ', ' + $scope.ciudadActual.d_ciudad.toUpperCase() + ', ' + $scope.cpActual;
                $scope.calleB = $scope.calle.replace(/ /gi, "+");
                $scope.coloniaActual.coloniaB = $scope.coloniaActual.colonia.replace(/ /gi, "+");
                $scope.municipioActual.municipioB = $scope.municipioActual.municipio.replace(/ /gi, "+");
                $scope.ciudadActual.d_ciudadB = $scope.ciudadActual.d_ciudad.replace(/ /gi, "+");
                var dir = $scope.calleB + "+" + $scope.exterior + "+" + $scope.coloniaActual.coloniaB + "+" + $scope.municipioActual.municipioB + "+" + $scope.ciudadActual.d_ciudadB + "+" + $scope.cpActual; //+ "+" + $scope.cpActual
                $scope.mapaActual = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFoh96sELDelI27Pfwk5mGLsqFYt99AZM&q=" + dir
                $scope.cadenaConfirma = "Está a punto de actualizar esta dirección ¿Desea continuar?"
                $scope.mensajeConfirma = '<div>' + $scope.direccionPre + '</div><iframe class="mapa" frameborder="0" style="border:0" src="' + $scope.mapaActual + '"></iframe>';
                bootbox.confirm({
                    title: $scope.cadenaConfirma,
                    message: $scope.mensajeConfirma,
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
                            $('#modalAltaDirecciones').modal('show')
                        }
                    }
                });
                // bootbox.alert({
                //     title: $scope.cadenaConfirma,
                //     message: '<div>' + $scope.direccionPre + '</div><iframe class="mapa" frameborder="0" style="border:0" src="' + $scope.mapaActual + '"></iframe>',
                //     size: 'large',
                //     callback: function(result) {
                //         if (result)
                //             resolve(1)
                //         else{
                //             reject(2)
                //             $('#modalAltaDirecciones').modal('show')
                //         }
                //     }
                // });
                // bootbox.confirm($scope.cadenaConfirma,
                //     function(result) {
                //         if (result)
                //             resolve(1)
                //         else
                //             reject(2)
                //     }
                // )
            }).then(function(operacion) {

                console.log('archivo:')
                console.log($scope.archivoComprobante)

                var files = $('#file-5').prop("files"); //$(ele).get(0).files;

                $scope.comprobante = 0;

                if (files.length > 0)
                    $scope.comprobante = 1;

                new Promise(function(resolve, reject) {
                    var datos = {
                        idDireccion: $scope.idDireccion,
                        idUsuario: $scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal: $scope.sucursalActual.AGENCIA,
                        estado: $scope.estadoActual.idEdo,
                        ciudad: $scope.ciudadActual.d_ciudad,
                        municipio: $scope.municipioActual.municipio,
                        colonia: $scope.coloniaActual.colonia,
                        cp: $scope.cpActual,
                        calle: $scope.calle,
                        exterior: $scope.exterior,
                        interior: $scope.interior,
                        referencia: $scope.referencia,
                        nombre1: $scope.nombre1,
                        apaterno1: $scope.apaterno1,
                        amaterno1: $scope.amaterno1,
                        rfc1: $scope.rfc1,
                        lada1: $scope.lada1,
                        tel1_1: $scope.tel1_1,
                        tel2_1: $scope.tel2_1,
                        correo1: $scope.correo1,
                        nombre2: $scope.nombre2,
                        apaterno2: $scope.apaterno2,
                        amaterno2: $scope.amaterno2,
                        rfc2: $scope.rfc2,
                        lada2: $scope.lada2,
                        tel1_2: $scope.tel1_2,
                        tel2_2: $scope.tel2_2,
                        correo2: $scope.correo2,
                        correoGeneral: $scope.correoGeneral,
                        archivo: $scope.archivoComprobante,
                        comprobante: $scope.comprobante
                    };

                    direccionRepository.postUpdateDireccion(datos).then(function(result) {

                        $scope.empresaActual = $scope.empresas[0];
                        $scope.sucursalActual = {};
                        $scope.estadoActual = {};
                        $scope.ciudadActual = {};
                        $scope.municipioActual = {};
                        $scope.coloniaActual = {};
                        $scope.cpActual = '';

                        $scope.calle = '';
                        $scope.exterior = '';
                        $scope.interior = '';
                        $scope.referencia = '';

                        $scope.nombre1 = '';
                        $scope.apaterno1 = '';
                        $scope.amaterno1 = '';
                        $scope.rfc1 = '';
                        $scope.lada1 = '';
                        $scope.tel1_1 = '';
                        $scope.tel2_1 = '';
                        $scope.correo1 = '';

                        $scope.nombre2 = '';
                        $scope.apaterno2 = '';
                        $scope.amaterno2 = '';
                        $scope.rfc2 = '';
                        $scope.lada2 = '';
                        $scope.tel1_2 = '';
                        $scope.tel2_2 = '';
                        $scope.correo2 = '';
                        $scope.correoGeneral = '';
                        resolve(result.data);
                    });

                }).then(function(respuesta) {

                    if (respuesta[0].estatus == 'ok') {
                        // $scope.guardarArchivo(respuesta.idDireccion, $scope.user.per_idpersona);
                        //

                        bootbox.alert({
                            title: respuesta[0].mensaje,
                            message: '<div class="col-sm-12 text-center"><div class="iconoExito"><i class="fa fa-check icon-circle icon-3x"></i></div></div>',
                            size: 'large',
                            callback: function() {
                                $('.modal-aprobacion').modal('hide')
                                $scope.init();
                                //$state.go("user.aprobacion")
                            }
                        });
                        //
                        // bootbox.alert("<h4> Dirección actualizada exitosamente. </h4>",
                        //     function() {
                        //         $('.modal-aprobacion').modal('hide')
                        //         $('#modalAltaDirecciones').modal('hide')
                        //     });
                        // $scope.init();
                    } //if respuesta.estatus = 0k
                    else { //error al guardar

                        console.log('error al guardar')
                        bootbox.alert({
                            title: respuesta[0].mensaje != undefined ? respuesta[0].mensaje : 'Ocurrió un error',
                            message: '<div class="col-sm-12 text-center"><div class="iconoError"><i class="fa fa-close icon-circle icon-3x"></i></div></div>',
                            size: 'large',
                            callback: function() {
                                $('.modal-aprobacion').modal('hide')
                                $scope.init();
                                //$state.go("user.aprobacion")
                            }
                        });

                        // bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                        //     function() {
                        //         $('.modal-aprobacion').modal('hide')
                        //         //$state.go("user.aprobacion")
                        //     });
                    }

                });

            }); //fin promise  

        }



    }; // fin actualiza direccion
    // // 


});