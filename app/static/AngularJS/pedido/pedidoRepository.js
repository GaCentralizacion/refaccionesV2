var pedidoURL = global_settings.urlCORS + 'api/pedido/';


registrationModule.factory('pedidoRepository', function($http) {
    return {
        busquedaPedido: function(usuario, status, empresa, sucursal, fechaInicio, fechaFin) {
            return $http({
                url: pedidoURL + 'busquedaPedido/',
                method: "GET",
                params: {
                    usuario: usuario,
                    status: status,
                    empresa: empresa,
                    sucursal: sucursal,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        busquedaPedidoUsuarioDetalle: function(pedido, usuario) {
            return $http({
                url: pedidoURL + 'busquedaPedidoUsuarioDEtalle/',
                method: "GET",
                params: {
                    pedido: pedido,
                    usuario: usuario
                },
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
        guardarPedido: function(pedido) {
            return $http({
                url: pedidoURL + 'create/',
                method: "POST",
                data: pedido,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});