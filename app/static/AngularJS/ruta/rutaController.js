registrationModule.controller('rutaController', function($sce,$http,$scope, $rootScope, $location, $timeout, alertFactory, rutaRepository, filterFactory, userFactory, globalFactory,operadorRepository,unidadRepository) {
            

            $scope.listOperadores=[];     
            $scope.bloquea=false;   
            $scope.add=false;
            $scope.tipo=1;
          

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

                               $scope.getOperadores();
                 $scope.getUnidades();
                            }, 100);

                        }

                    } else {
                        alertFactory.success('No se encontraron empresas');
                     }
                });
                
                 

        }; 


        $scope.cambioEmpresa = function() {
                if ($scope.empresaActual.emp_idempresa != 0) {

                    $scope.histEmpresa = []
                    console.log('empresa actual')
                    console.log($scope.empresaActual)
                        //console.log($scope.empresaActual)

                    $scope.histEmpresa.push({
                            emp_idempresa: $scope.empresaActual.emp_idempresa,
                            emp_nombre: $scope.empresaActual.emp_nombre,
                            emp_nombrecto: $scope.empresaActual.emp_nombrecto
                        })
                        //$scope.histEmpresa.push($scope.empresaActual);
                    localStorage.setItem('histEmpresa', JSON.stringify($scope.histEmpresa));
                    //}

                    $scope.consultaSucursales();

                } else {
                    $scope.sucursales = $scope.sucursalActual = null;
                    localStorage.removeItem('histEmpresa')
                    localStorage.removeItem('histSucursal')
                }
    };
    

            $scope.consultaSucursales = function() {
                filterFactory.getSucursales($scope.Usuario.idUsuario,$scope.empresaActual.emp_idempresa, 'user').then(function(result) {
                        if (result.data.length > 0) {
                              $scope.sucursales = result.data;
                              $scope.sucursalActual = $scope.sucursales[0];
                                 //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                                if (localStorage.getItem('histSucursal') !== null) {

                                    $scope.histSucursal = []
                                    
                                    //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                                    $scope.tempHistSuc = localStorage.getItem('histSucursal')
                                    $scope.histSucursal.push(JSON.parse($scope.tempHistSuc))

                                    console.log('$scope.histSucursal')
                                    console.log($scope.histSucursal[0][0])

                                    setTimeout(function() {

                                        $("#selSucursales").val($scope.histSucursal[0][0].AGENCIA);
                                        $scope.sucursalActual = $scope.histSucursal[0][0]; //$scope.empresas;

                                        $scope.consultaPedidos($scope.empresaActual, $scope.sucursalActual, $scope.fecha , $scope.fechaFin);
                                        
                                    }, 100);

                                } //SET SUCURSAL DESDE LOCALSTORAGE   END
                        }
                 });
            };
      


     $scope.cambioSucursal = function(empresa) {

            

                if ($scope.sucursalActual.AGENCIA != 0) {

                    $scope.histSucursal = []
                    console.log('sucursal actual')
                    console.log($scope.sucursalActual)
                        //console.log($scope.empresaActual)

                    $scope.histSucursal.push({
                            AGENCIA: $scope.sucursalActual.AGENCIA,
                            NOMBRE_AGENCIA: $scope.sucursalActual.NOMBRE_AGENCIA,
                            IDSUC: $scope.sucursalActual.IDSUC,
                            suc_nombrecto: $scope.sucursalActual.suc_nombrecto
                        })
                        //$scope.histEmpresa.push($scope.empresaActual);
                        console.log('agregando sucursal actual a localStorage')
                    localStorage.setItem('histSucursal', JSON.stringify($scope.histSucursal));
                } else {
                    localStorage.removeItem('histSucursal')
                }
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

          $scope.newRuta=function(){
                $scope.setTablePaging('tblOperadoresUnidadesRutas');

                $("#tblOperadoresUnidadesRutas_length").removeClass("dataTables_info").addClass("hide-div");
                $("#tblOperadoresUnidadesRutas_filter").removeClass("dataTables_info").addClass("pull-left");
          };

        $scope.getOperadores=function(){
           $('#tblOperadores').DataTable().destroy();
           $scope.listOperadores=[]; 
            if($scope.empresaActual.emp_idempresa!=0){
                operadorRepository.getOperadores($scope.empresaActual.emp_idempresa).then(function(result){
                    if(result.data.length>0){
                    $scope.listOperadores=result.data;
                            setTimeout(function() {
                                $scope.setTablePaging('tblOperadores');

                                $("#tblOperadores_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblOperadores_filter").removeClass("dataTables_info").addClass("pull-left");

                            }, 1);
                        }else { alertFactory.info("No se encontraron resultados !!"); $scope.listOperadores=[];}
                });
            }else{$scope.listOperadores=[];}
        };

         $scope.getUnidades=function(){
           $('#tblUnidades').DataTable().destroy();
           $scope.listUnidades=[]; 
            if($scope.empresaActual.emp_idempresa!=0){
                unidadRepository.getUnidades($scope.empresaActual.emp_idempresa).then(function(result){
                    if(result.data.length>0){
                    $scope.listUnidades=result.data;
                            setTimeout(function() {
                                $scope.setTablePaging('tblUnidades');

                                $("#tblUnidades_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblUnidades_filter").removeClass("dataTables_info").addClass("pull-left");

                            }, 1);
                        }else { alertFactory.info("No se encontraron resultados !!"); $scope.listUnidades=[];}
                });
            }else{$scope.listUnidades=[];}
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
            };//end setTablePaging

        

           
});