var pedidoView = require('../views/reference'),
    pedidoModel = require('../models/dataAccess')


var pedido = function(conf) {
    this.conf = conf || {};

    this.view = new pedidoView();
    this.model = new pedidoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

pedido.prototype.get_busquedaPedido = function(req, res, next) {
    var self = this;

 

    var params = [
        { name: 'idUsuario', value: req.query.tipo, type: self.model.types.INT },
        { name: 'estatus', value: 1, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.empresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.sucursal, type: self.model.types.INT },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING }
    ];
     console.log(params);
    self.model.query('SEL_PEDIDO_USUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = pedido;
