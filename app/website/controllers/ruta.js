var rutaView = require('../views/reference'),
    rutaModel = require('../models/dataAccess'),
    jsonxml = require('jsontoxml')


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
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'nombreRuta', value: req.body.nombreRuta, type: self.model.types.STRING },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },
        { name: 'idSucursal', value: req.body.idSucursal, type: self.model.types.INT }

    ];

    console.log(params);
    self.model.query('INS_RUTA_SP ', params, function(error, result) {
        console.log(result);
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ruta.prototype.post_update = function(req, res, next) {
    var self = this;


    var params = [
        { name: 'idRuta', value: req.body.idRuta, type: self.model.types.INT },
        { name: 'tipo', value: req.body.tipo, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'nombreRuta', value: req.body.nombreRuta, type: self.model.types.STRING },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },

    ];

    console.log(params);
    self.model.query('UPD_RUTA_SP ', params, function(error, result) {
        console.log(result);
        console.log(error);
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ruta.prototype.get_rutasShow = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    self.model.query('SEL_RUTAS_EMRPESA_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ruta.prototype.get_catalogoRutas = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('SEL_RUTAS_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = ruta;