var pedidoURL = global_settings.urlCORS + 'api/pedido/';


registrationModule.factory('pedidoRepository', function ($http) {
    return {
        busquedaPedido: function (usuario,status,empresa,sucursal,fechaInicio,fechaFin) {
            return $http({
                url: pedidoURL + 'busquedaPedido/',
                method: "GET",
                params: {
                    usuario:usuario,
                    status:status,
                    empresa: empresa,
                    sucursal: sucursal,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
              
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});