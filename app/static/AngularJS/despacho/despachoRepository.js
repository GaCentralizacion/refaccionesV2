var despachoURL = global_settings.urlCORS + 'api/despacho/';


registrationModule.factory('despachoRepository', function($http) {
    return {
        postCreate: function(despacho) {
            return $http({
                url: despachoURL + 'create/',
                method: "POST",
                data: despacho,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getRutas: function(idEmpresa) {
            return $http({
                url: despachoURL + 'rutasShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postUpdate: function(ruta) {
            return $http({
                url: despachoURL + 'update/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postDelete: function(ruta) {
            return $http({
                url: despachoURL + 'delete/',
                method: "POST",
                data: ruta,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPedidos: function(idEmpresa) {
            return $http({
                url: despachoURL + 'pedidosShow/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getReportePdf: function(jsondata) {
            return $http({
                url: 'http://192.168.20.89:5488/api/report',
                method: "POST",
                data: {
                    template: { name: jsondata.template.name },
                    data: jsondata.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
        getBusquedaPedidoDetalle: function(pedido, usuario) {
            return $http({
                url: despachoURL + 'busquedaPedidoDetalle/',
                method: "GET",
                params: {
                    pedido: pedido
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postGnrDespacho: function(despacho) {
            return $http({
                url: despachoURL + 'gnrDespacho/',
                method: "POST",
                data: despacho,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        // getCatalogoRutas: function(idEmpresa) {
        //     return $http({
        //         url: despachoURL + 'catalogoRutas/',
        //         method: "GET",
        //         params: { idEmpresa: idEmpresa },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },


    };
});