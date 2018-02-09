var cotizacionesView = require('../views/reference'),
    cotizacionesModel = require('../models/dataAccess'),
    jsonxml = require('jsontoxml')

var cotizaciones = function(conf) {
    this.conf = conf || {};

    this.view = new cotizacionesView();
    this.model = new cotizacionesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

// Gets a list of Cotizacions
cotizaciones.prototype.get_index = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'sucursal', value: req.query.idSucursal, type: self.model.types.STRING },
        { name: 'empresa', value: req.query.idEmpresa, type: self.model.types.STRING }
    ];
    self.model.query('SEL_COTIZACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
// Gets a single Cotizacion from the DB
cotizaciones.prototype.get_show = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idCotizacion', value: req.query.id, type: self.model.types.INT }
    ];
    self.model.query('SEL_COTIZACIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
// Creates a new Cotizacion in the DB
cotizaciones.prototype.post_create = function(req, res, next) {
    var self = this;
    for (var i = 0; i < req.body.refacciones.length; i++) {
        req.body.refacciones[i] = {
            refaccion: req.body.refacciones[i]
        }
    }
    var params = [
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        {
            name: 'refacciones',
            value: jsonxml({
                refacciones: req.body.refacciones
            }),
            type: self.model.types.STRING
        },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'base', value: req.body.base, type: self.model.types.STRING },
        { name: 'total', value: req.body.total, type: self.model.types.DECIMAL },
        { name: 'empresa', value: req.body.empresa, type: self.model.types.STRING },
        { name: 'sucursal', value: req.body.sucursal, type: self.model.types.STRING }
    ];
    self.model.query('INS_COTIZACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
// Updates an existing Cotizacion in the DB
cotizaciones.prototype.post_update = function(req, res, next) {
    var self = this;
    for (var i = 0; i < req.body.refacciones.length; i++) {
        req.body.refacciones[i] = {
            refaccion: req.body.refacciones[i]
        }
    }
    var params = [
        { name: 'idCotizacion', value: req.body.idCotizacion, type: self.model.types.INT },
        {
            name: 'refacciones',
            value: jsonxml({
                refacciones: req.body.refacciones
            }),
            type: self.model.types.STRING
        },
        { name: 'total', value: req.body.total, type: self.model.types.DECIMAL }
    ];
    self.model.query('UPD_COTIZACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
// Deletes a Cotizacion from the DB
cotizaciones.prototype.get_destroy = function(req, res, next) {
    var self = this;
    var params = [
        { name: 'idCotizacion', value: req.query.id, type: self.model.types.INT }
    ];
    self.model.query('DEL_ESTATUS_COTIZACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = cotizaciones;