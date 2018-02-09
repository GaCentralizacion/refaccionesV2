registrationModule.controller('direccionesController', function($sce,$scope, $rootScope, $location, $timeout, alertFactory, filterFactory, userFactory, globalFactory,direccionRepository) {
    
   

   $scope.init = function() {
        $scope.Usuario = userFactory.getUserData();
        $scope.getEmpresas();
        $scope.verTabD=false;
        $scope.verTabP=true;
        $scope.actD='active';

    };

  $scope.getEmpresas = function() {
        filterFactory.getEmpresas($scope.Usuario.idUsuario, 'admin').then(function(result) {
            if (result.data.length > 0) {
                 $scope.empresas =result.data;
                 $scope.empresaActual = $scope.empresas[0];
            } else {
                alertFactory.success('No se encontraron empresas');
            }

        });
    };


    $scope.cambioEmpresa = function() {
        if ($scope.empresaActual.emp_idempresa != 0) {

            //$scope.histEmpresa = []
            console.log('empresa actual')
            console.log($scope.empresaActual)


            $scope.consultaSucursales();

        } else {

        }
    };


    $scope.consultaSucursales = function() {

       filterFactory.getSucursales($scope.Usuario.idUsuario, $scope.empresaActual.emp_idempresa, 'user').then(function(result) {
                $scope.sucursales = result.data;
                $scope.sucursalActual = $scope.sucursales[0];


                //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                if (localStorage.getItem('histSucursal') !== null) {

                    $scope.histSucursal = []

                    //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                    $scope.tempHistSuc = localStorage.getItem('histSucursal')
                    $scope.histSucursal.push(JSON.parse($scope.tempHistSuc))

                    setTimeout(function() {

                        $("#selSucursales").val($scope.histSucursal[0][0].AGENCIA);
                        $scope.sucursalActual = $scope.histSucursal[0][0]; //$scope.empresas;                            

                    }, 100);

                } //SET SUCURSAL DESDE LOCALSTORAGE   END
			});
           // })
        };

 	  $scope.cambioSucursal = function(empresa, sucursal, fecha) {

               var datos = {
                            idUsuario: $scope.Usuario.idUsuario,
                            idEmpresa: $scope.empresaActual.emp_idempresa,
                            idSucursal: $scope.sucursalActual.AGENCIA,
                            opcion: 2,
                            idEstatus: 1,
                            role:'user'
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
                });

   	 };

      $scope.verDetalleDireccion=function(direccion){
       $scope.direccion=direccion;
          $('#modal-direccion').modal('show');      
      };

      $scope.verTabs=function(tipo){
            if(tipo==1){
                $scope.verTabP=true;
                $scope.verTabD=false;
                $scope.actD='active';
                $scope.actP='';
            }
            else{
                 $scope.verTabP=false;
                 $scope.verTabD=true;
                 $scope.actP='active';
                 $scope.actD='';
            }
      };

    $scope.consultaEstado = function() {

            var datos={
                        user:$scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal:$scope.sucursalActual.AGENCIA
                      };

            direccionRepository.getEstado(datos).then(function(result){
            	 $scope.Estados = result.data;
            	 $scope.Estados.unshift({ idEdo: "0", descripcion: "Seleccioné ..." });
                 $scope.estadoActual = $scope.Estados[0];

            });
        };



	$scope.cambioEstado = function() {

		$scope.consultaCiudad();

	};


        $scope.consultaCiudad = function() {

            var datos={
                        user:$scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal:$scope.sucursalActual.AGENCIA, 
                        estado:$scope.estadoActual.descripcion
                      };

              direccionRepository.getCiudad(datos).then(function(result){
   			    $scope.Ciudades =  result.data;
   			    $scope.Ciudades.unshift({d_ciudad: "Seleccioné ..." });
            	$scope.ciudadActual = $scope.Ciudades[0];

              });
        };


        $scope.cambioCiudad = function() {

            $scope.consultaMunicipio();

        };


      

        $scope.consultaMunicipio = function() {

             var datos={
                        user:$scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal:$scope.sucursalActual.AGENCIA, 
                        estado:$scope.estadoActual.descripcion,
                        ciudad:$scope.ciudadActual.d_ciudad
                      };

                 direccionRepository.getMunicipio(datos).then(function(result){

                 	 $scope.Municipios = result.data;
                 	 $scope.Municipios.unshift({municipio: "Seleccioné ..." });
            	     $scope.municipioActual = $scope.Municipios[0];
                 });
        };

          $scope.cambioMunicipio = function() {

            $scope.consultaColonia();

        };

       

        $scope.consultaColonia = function() {

            var datos={
                        user:$scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal:$scope.sucursalActual.AGENCIA, 
                        estado:$scope.estadoActual.descripcion,
                        ciudad:$scope.ciudadActual.d_ciudad,
                        municipio:$scope.municipioActual.municipio
                      };

              direccionRepository.getColonia(datos).then(function(result){
 				 $scope.Colonias = result.data;
 				 $scope.Colonias.unshift({colonia: "Seleccioné ..."});
                 $scope.coloniaActual = $scope.Colonias[0];
              });
        };

           $scope.cambioColonia = function() {

            $scope.consultaCp();

        };

        $scope.consultaCp = function() {

                  var datos={
                        user:$scope.Usuario.idUsuario,
                        idEmpresa: $scope.empresaActual.emp_idempresa,
                        idSucursal:$scope.sucursalActual.AGENCIA, 
                        estado:$scope.estadoActual.descripcion,
                        ciudad:$scope.ciudadActual.d_ciudad,
                        municipio:$scope.municipioActual.municipio,
                        colonia: $scope.coloniaActual.colonia
                      };

              direccionRepository.getCp(datos).then(function(result){
              	      $scope.Codigos = result.data;
              	      $scope.Codigos.unshift({ cp: "Seleccioné ..."});
            		  $scope.cpActual = $scope.Codigos[0];
              });
        };







    $scope.guardaDireccion = function() {

                        new Promise(function(resolve, reject) {

                                $scope.cadenaConfirma = "<h4>Está a punto de registrar esta dirección ¿Desea continuar?</h4>"

                                bootbox.confirm($scope.cadenaConfirma,
                                    function(result) {
                                        if (result)
                                            resolve(1)
                                        else
                                            reject(2)
                                    }
                                )
                            }).then(function(operacion) {

                                console.log('archivo:')
                                console.log($scope.archivoComprobante)

                                var files = $('#avatar').prop("files"); //$(ele).get(0).files;

                                $scope.comprobante = 0;

                                if (files.length > 0)
                                    $scope.comprobante = 1;

                                new Promise(function(resolve, reject) {
                                 var datos={
                                            idUsuario: $scope.Usuario.idUsuario,
                                            idEmpresa: $scope.empresaActual.emp_idempresa,
                                            idSucursal: $scope.sucursalActual.AGENCIA,
                                            estado: $scope.estadoActual.idEdo,
                                            ciudad: $scope.ciudadActual.d_ciudad,
                                            municipio: $scope.municipioActual.municipio,
                                            colonia: $scope.coloniaActual.colonia,
                                            cp: $scope.cpActual.cp,
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

                                      direccionRepository.postCreate(datos).then(function(result){
                                        
                                                    $scope.empresaActual = $scope.empresas[0];
                                                    $scope.sucursalActual = {};
                                                    $scope.estadoActual = {};
                                                    $scope.ciudadActual = {};
                                                    $scope.municipioActual = {};
                                                    $scope.coloniaActual = {};
                                                    $scope.cpActual = {};

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
                                            });

                                    } //if respuesta.estatus = 0k
                                    else { //error al guardar

                                        console.log('error al guardar')

                                        bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                                            function() {
                                                $('.modal-aprobacion').modal('hide')
                                                    //$state.go("user.aprobacion")
                                            });
                                    }

                                });

                            }); //fin promise                    

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
    };//end setTablePaging


});