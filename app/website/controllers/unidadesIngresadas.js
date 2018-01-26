var unidadesIngresadasView = require('../views/reference'),
    unidadesIngresadasModel = require('../models/dataAccess')

var unidadesIngresadas = function(conf) {
    this.conf = conf || {};

    this.view = new unidadesIngresadasView();
    this.model = new unidadesIngresadasModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

unidadesIngresadas.prototype.get_unidadesIngresadas = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];
    self.model.query('SEL_UNIDADES_INGRESADAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

unidadesIngresadas.prototype.get_insertNotificacion = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'numeroSerie', value: req.query.numeroSerie, type: self.model.types.STRING },
        { name: 'solicitante', value: req.query.solicitante, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];
    console.log(params)
    self.model.query('INS_APROBACION_INGRESADAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = unidadesIngresadas;