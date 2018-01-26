var filtrosView = require('../views/reference'),
    filtrosModel = require('../models/dataAccess')

var filtros = function(conf) {
    this.conf = conf || {};

    this.view = new filtrosView();
    this.model = new filtrosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
filtros.prototype.get_empresas = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
                  ,{ name: 'role', value: req.query.rol, type: self.model.types.STRING }];
    console.log('soy los parametros', params)
    self.model.query('SEL_EMPRESA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
filtros.prototype.get_sucursales = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];
    self.model.query('SEL_SUCURSALES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = filtros;