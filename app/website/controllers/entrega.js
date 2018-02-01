var entregaView = require('../views/reference'),
    entregaModel = require('../models/dataAccess')


var entrega = function(conf) {
    this.conf = conf || {};

    this.view = new entregaView();
    this.model = new entregaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
entrega.prototype.get_refacciones = function(req, res, next) {

    var self = this;

    var params = [{ name: 'descripcion', value: req.query.descripcion, type: self.model.types.STRING },
        { name: 'par_idenpara', value: req.query.par_idenpara, type: self.model.types.STRING },
        { name: 'par_tipopara', value: req.query.par_tipopara, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.STRING }
    ];

    self.model.query('SEL_REFACCION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = entrega;