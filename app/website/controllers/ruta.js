var rutaView = require('../views/reference'),
    rutaModel = require('../models/dataAccess')


var ruta = function(conf) {
    this.conf = conf || {};

    this.view = new rutaView();
    this.model = new rutaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ruta.prototype.post_create = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'nombreRuta', value: req.body.nombreRuta, type: self.model.types.STRING },
        { name: 'descripcion', value:  req.body.descripcion, type: self.model.types.STRING },
        { name: 'idResponsable', value: req.body.idResponsable, type: self.model.types.INT },
        { name: 'idEmpresa', value:  req.body.idEmpresa, type: self.model.types.STRING },
      	];

    self.model.query('INS_RUTA_SP ', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ruta.prototype.get_rutasShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_RUTAS_EMRPESA_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ruta;