registrationModule.controller('operadorController', function($sce,$http,$scope, $rootScope, $location, $timeout, alertFactory, operadorRepository, filterFactory, userFactory, globalFactory) {
            

            $scope.listOperadores=[];     
            $scope.bloquea=false;   
            $scope.add=false;
            $scope.tipo=1;
          

           $scope.init = function() {
                $scope.Usuario = userFactory.getUserData();
                $scope.getEmpresas();
             
            };


        $scope.getEmpresas = function() {
                filterFactory.getEmpresas($scope.Usuario.idUsuario,  $scope.Usuario.rol).then(function(result) {           
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


        $scope.operador=function(tipo){
          
                new Promise(function(resolve, reject) {

                            if($scope.bloquea==false) $scope.cadenaConfirma = "<h4>Está a punto de confirmar  al operador "+ $scope.nombre+" "+$scope.apPaterno+" "+$scope.apMaterno+ "<br> con el telefono "+$scope.telefono+" ¿Desea continuar?</h4>"
                               else $scope.cadenaConfirma = "<h4>Está a punto de eliminar al operador "+ $scope.nombre+" "+$scope.apPaterno+" "+$scope.apMaterno+ "¿Desea continuar?</h4>"

                                bootbox.confirm($scope.cadenaConfirma,
                                    function(result) {
                                        if (result) resolve(1)
                                        else reject(2)
                                    }
                                )
                            }).then(function(operacion) {
                                 new Promise(function(resolve, reject) {
                                if($scope.bloquea==true)$scope.tipo=0;
                                 var datos={
                                            nombre: $scope.nombre,
                                            apPaterno: $scope.apPaterno,
                                            apMaterno: $scope.apMaterno,
                                            telefono:$scope.telefono,
                                            idEmpresa: $scope.empresaActual.emp_idempresa,
                                           
                                          };

                            if($scope.add==true) 
                                operadorRepository.postCreate(datos).then(function(result){ 
                                    // $scope.limpaValores();
                                    resolve(result.data);
                                });  
                                  else {
                                         datos.idOperador=$scope.idOperador;
                                         datos.estatus=$scope.tipo;
                                    operadorRepository.postUpdate(datos).then(function(result){
                                        //    $scope.limpaValores();
                                          resolve(result.data);
                                      });
                                     }
                               
       
                                 }).then(function(respuesta) {

                                    if (respuesta.estatus = 'ok') {
                                        $scope.cambioEmpresa();
                                       bootbox.alert("<h4> Operacion realizada!!. </h4>",
                                            function() {
                                                $('#modalAddOperador').modal('hide')
                                            });

                                    } 
                                    else { //error al guardar
                                             bootbox.alert("<h4>" + respuesta.mensaje + " </h4>",
                                            function() {
                                                $('#modalAddOperador').modal('hide')
                                                    //$state.go("user.aprobacion")
                                            });
                                    }
                                     

                                });

                            }); //fin promise     
                                       
        };

      $scope.limpaValores=function(){
        // $scope.nombre = "";
        // $scope.apPaterno = "";
        // $scope.apMaterno = "";
        // $scope.telefono="";
        $scope.tipo=1;
        $scope.bloquea=false;
        // datos={};
        $scope.add=false;
     //   $scope.listOperadores=[];     

      };

        $scope.modalOperador=function(operador,tipo){
         
             $('#modalAddOperador').modal('show');
            if(tipo==1){
                $scope.add=true;$scope.bloquea=false;
            }
            if(tipo==2){
                $scope.add=false;$scope.bloquea=false;
            }
            else if(tipo==3){
                $scope.add=false;$scope.bloquea=true;
            } 
            if(operador!=null){
                $scope.idOperador=operador.idOperador;
                $scope.nombre=operador.nombre;
                $scope.apPaterno=operador.apellidoPaterno;
                $scope.apMaterno=operador.apellidoMaterno;
                $scope.telefono=operador.telefono;
            }
        };

        $scope.cambioEmpresa=function(){
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