var pedidoView = require('../views/reference'),
    pedidoModel = require('../models/dataAccess')


var pedido = function(conf) {
    this.conf = conf || {};

    this.view = new monitorView();
    this.model = new monitorModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

pedido.prototype.get_busquedaPedido = function(req, res, next) {
    var self = this;

 

    // var params = [
    //     { name: 'tipo', value: req.query.tipo, type: self.model.types.INT },
    //     { name: 'empresa', value: req.query.empresa, type: self.model.types.INT },
    //     { name: 'sucursal', value: req.query.sucursal, type: self.model.types.INT },
    //     { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
    //     { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING },
    //     { name: 'lote', value: req.query.lote, type: self.model.types.INT },
    //     { name: 'persona', value: req.query.persona, type: self.model.types.INT },
    // ];
    //  console.log(params);
    // self.model.query('SEL_MONITOR_ERROR', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
}


module.exports = pedido;
