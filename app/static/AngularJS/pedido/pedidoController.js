registrationModule.controller('pedidoController', function($sce,$http,$scope, $rootScope, $location, $timeout, alertFactory, pedidoRepository, filterFactory, userFactory, globalFactory) {
            
            $scope.listaPedidos = [];

           $scope.init = function() {
                $scope.Usuario = userFactory.getUserData();
                $scope.getEmpresas();
            };


            $scope.getEmpresas = function() {
                filterFactory.getEmpresas($scope.Usuario.idUsuario, 'admin').then(function(result) {           
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

                                $scope.consultaSucursales();
                            }, 100);

                        }

                    } else {
                        alertFactory.success('No se encontraron empresas');
                     }
                });

            }; 


            $scope.consultaSucursales = function() {
                  $scope.muestraAgencia = false;
                    filterFactory.getSucursales($scope.Usuario.idUsuario,$scope.empresaActual.emp_idempresa, 'admin').then(function(result) {
                        if (result.data.length > 0) {
                                    $scope.sucursales = result.data;
                                    $scope.sucursalActual = $scope.sucursales[0];


                                    //SET SUCURSAL DESDE LOCALSTORAGE   BEGIN
                                    if (localStorage.getItem('pedSucursal') !== null) {

                                        $scope.pedSucursal = []

                                        //$scope.histEmpresa = localStorage.getItem('histEmpresa')
                                        $scope.tempPedSuc = localStorage.getItem('pedSucursal')
                                        $scope.pedSucursal.push(JSON.parse($scope.tempPedSuc))

                                        console.log('$scope.pedSucursal')
                                        console.log($scope.pedSucursal[0][0])

                                        setTimeout(function() {

                                            $("#selSucursales").val($scope.pedSucursal[0][0].AGENCIA);
                                            $scope.sucursalActual = $scope.pedSucursal[0][0]; //$scope.empresas;

                                            $scope.consultaPedidos($scope.empresaActual, $scope.sucursalActual, $scope.fecha, $scope.fechaFin);

                                        }, 100);

                                    } //SET SUCURSAL DESDE LOCALSTORAGE  END

                        }
                });
            }; //END consultaSucursales

            $scope.cambioEmpresa = function() {
                if ($scope.empresaActual.emp_idempresa != 0) {

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
                    $scope.sucursales = $scope.sucursalActual = null;
                    localStorage.removeItem('pedEmpresa')
                    localStorage.removeItem('pedSucursal')
                }
            };

            $scope.cambioSucursal = function(empresa, sucursal, fecha,fechaFin) {

                    $scope.consultaPedidos(empresa, sucursal, fecha, fechaFin);

                    if ($scope.sucursalActual.AGENCIA != 0) {

                        $scope.pedSucursal = []

                        $scope.pedSucursal.push({
                                AGENCIA: $scope.sucursalActual.AGENCIA,
                                NOMBRE_AGENCIA: $scope.sucursalActual.NOMBRE_AGENCIA,
                                IDSUC: $scope.sucursalActual.IDSUC,
                                suc_nombrecto: $scope.sucursalActual.suc_nombrecto
                            })
                            //$scope.histEmpresa.push($scope.empresaActual);
                        console.log('agregando sucursal actual a localStorage')
                        localStorage.setItem('pedSucursal', JSON.stringify($scope.pedSucursal));
                    } else {
                        localStorage.removeItem('pedSucursal')
                    }

            }; //end cambioSucursal

          

            $scope.consultaPedidos = function(empresa, sucursal, fecha, fechaFin) {

                    $scope.pedidos=[
                        {
                            idPedidoRef:1,
                            ID_Pedido:1,
                            folioPedido:'AA-00-01',
                            PMM_FECHA:'30/01/2018',
                            empresaNombre:' Andrade',
                            sucursalNombre:'Suzuki Universidad',
                            total:10000,
                            estatus:'P',
                            color:'#003744'
                        },
                        {
                            idPedidoRef:2,
                            ID_Pedido:2,
                            folioPedido:'AA-00-02',
                            PMM_FECHA:'30/01/2018',
                            empresaNombre:' Andrade',
                            sucursalNombre:'Suzuki Universidad',
                            total:80000,
                            estatus:'P',
                            color:'#003744'
                        }
                    ];
                    $scope.listaPedidos=[ $scope.pedidos ];


                    // pedidoRepository.busquedaPedido($scope.Usuario.idUsuario,1, empresa.emp_idempresa,sucursal.AGENCIA,fecha,fechaFin).then(function(result) {
                    //  if (result.data.length > 0) { 

                    //         $scope.listaPedidos = result.data;
                    //         //$scope.listaPedidos2 = data;

                          $('#tblPedidoFiltros').DataTable().destroy();

                          setTimeout(function() {
                                $scope.setTablePaging('tblPedidoFiltros');

                                $("#tblPedidoFiltros_length").removeClass("dataTables_info").addClass("hide-div");
                                $("#tblPedidoFiltros_filter").removeClass("dataTables_info").addClass("pull-left");

                            }, 100);
                    //     }else{
                    //         alertFactory.pedidos('No se encontraron resultados'); 
                    //     }



                    //     });

                   
            }; //end consultaPedidos




            $scope.detallePedido = function(){

           
                    pedidoRepository.busquedaPedidoUsuarioDetalle().then(function(result) {
                        console.log(result.data);

                        // if(result.data.length>0)
                        // {

                        //     $scope.detalles = result.data;
                        //     $scope.empresa = data;

                        //     var i = 0;
                        //     $scope.subtotal = 0;
                        //     angular.forEach($scope.detalles, function(value, key) {
                        //         $scope.subtotal += $scope.detalles[i].totalItem;
                        //         i++;
                        //     });

                        //     $scope.idpedido = $stateParams.idpedido;
                        //     console.log($scope.detalles.length);

                        //     $scope.totalPedido = 0;

                        //     data.data.forEach(function(entry) {
                        //         $scope.totalPedido += entry.totalItem;
                        //     }, this);

                        // }


                            $scope.empresa =
                            {
                            Nombre:'Andrade',
                            FECHAPEDIDO:'30/01/2018',
                            DIRECCION:'Calle X Numero #45',
                            TELEFONO:123456,
                            DIRCLIENTE:'calle Y #70',
                            CORREOCLIENTE:'p@gmail.com',
                            TELCLIENTE:987654
                            };
                            $scope.detalles=[
                                {PTS_IDPARTE:10151111,PTS_DESPARTE:'Sensor de estacionamiento',PTS_PCOLISTA:10000,prd_cantidadsolicitada:1,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0056,totalItem:10000},
                                {PTS_IDPARTE:20000002,PTS_DESPARTE:'Bobina',PTS_PCOLISTA:400,prd_cantidadsolicitada:1,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0057,totalItem:400},
                                {PTS_IDPARTE:34444555,PTS_DESPARTE:'Bujia',PTS_PCOLISTA:100,prd_cantidadsolicitada:4,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0058,totalItem:400},
                            ];


                        $('#modalDetalle').modal('show');


                    });
            };
          

            $scope.imprimir = function() {

                var rptStructure = {};

                rptStructure.refacciones =[
                                {PTS_IDPARTE:10151111,PTS_DESPARTE:'Sensor de estacionamiento',PTS_PCOLISTA:10000,prd_cantidadsolicitada:1,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0056,totalItem:10000},
                                {PTS_IDPARTE:20000002,PTS_DESPARTE:'Bobina',PTS_PCOLISTA:400,prd_cantidadsolicitada:1,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0057,totalItem:400},
                                {PTS_IDPARTE:34444555,PTS_DESPARTE:'Bujia',PTS_PCOLISTA:100,prd_cantidadsolicitada:4,color:'#003744',estatusPieza:'SURTIDO',idPedidoBPRO:0058,totalItem:400},
                            ];

                // rptStructure.empresa =[{ 'idpedido':$stateParams.id,'FECHAPEDIDO':$scope.empresa.FECHAPEDIDO,'NOMBRE':$scope.empresa.NOMBRE,
                //                          'DIRECCION':$scope.empresa.DIRECCION,'name':$scope.user.name,'TELEFONO': $scope.empresa.TELEFONO,
                //                          'DIRCLIENTE':$scope.empresa.DIRCLIENTE,'CORREOCLIENTE':$scope.empresa.CORREOCLIENTE,
                //                          'TELCLIENTE': $scope.empresa.TELCLIENTE,'subtotal': $scope.subtotal,'iva':($scope.subtotal * .16),
                //                          'total':$scope.totalPedido + ($scope.subtotal * .16),'colorEstatus': $scope.colorEstatus,'estatus':$scope.estatus}];
    


                 rptStructure.empresa =[{ 'idpedido':1,'FECHAPEDIDO':'30/01/2018','NOMBRE':'Andrade',
                                         'DIRECCION':'Calle X Numero #45','name':'Andrade','TELEFONO': 987654,
                                         'DIRCLIENTE':'Calle X Numero #45','CORREOCLIENTE':'p@gmail.com',
                                         'TELCLIENTE': 987654,'subtotal':10800,'iva':1728,
                                         'total':12528,'colorEstatus':'#003744','estatus':'SURTIDO'}];
    

                var jsonData = {
                    "template": { "name": "facturaRefacciones_rpt" },
                    "data": rptStructure
                }

                $scope.generarPDF(jsonData);

             };


              $scope.generarPDF = function(jsonData) {
                //console.log('Llamada externa');
                // $http({
                //  //   url: 'http://189.204.141.193:5488/api/report/',
                //    // url: 'http://192.168.20.29:5000/api/layout/newpdf/',
                //    url:'http://192.168.20.89:5488/api/report',
                //     method: "POST",
                //     data: { values: jsonData},
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // }).then(function(fileName){

                //         setTimeout(function() {
                //             window.open("http://192.168.20.89:5488/api/layout/viewpdf?fileName=" + fileName.data);
                //             console.log(fileName.data);
                //         }, 5000);

                // });


                      //  $('#reporteModalPdf').modal('show');
      new Promise(function(resolve, reject) {
     
         
                resolve(jsonData);
                }).then(function(jsonData) {
                    pedidoRepository.getReportePdf(jsonData).then(function(result){
                        var file = new Blob([result.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                        window.open($scope.rptResumenConciliacion);
                    //    $('#reporteModalPdf').modal('show'); 
                    });
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
            };


});