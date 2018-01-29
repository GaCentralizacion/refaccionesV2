var historialURL = global_settings.urlCORS + 'api/historial/';


registrationModule.factory('historialRepository', function ($http) {
    return {
        // busquedaPedido: function (empresa,sucursal,fechaInicio,fechaFin) {
        //     return $http({
        //         url: pedidoURL + 'busquedaPedido/',
        //         method: "GET",
        //         params: {
                
        //             empresa: empresa,
        //             sucursal: sucursal,
        //             fechaInicio: fechaInicio,
        //             fechaFin: fechaFin,
              
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // }
    };
});