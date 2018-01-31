var busquedaView = require('../views/reference'),
    busquedaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var busqueda = function(conf) {
    this.conf = conf || {};

    this.view = new busquedaView();
    this.model = new busquedaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
busqueda.prototype.get_refacciones = function(req, res, next) {

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
busqueda.prototype.get_plantillas = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'empresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'sucursal', value: req.query.idSucursal, type: self.model.types.STRING }
    ];

    self.model.query('SEL_PLANTILLA_SP', params, function(error, result) {
        result.unshift({
            idCotizacionPlantilla: 0,
            descripcion: "Selecciona ..."
        });
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
busqueda.prototype.get_infoPlantilla = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idCotizacionPlantilla', value: req.query.idPlantilla, type: self.model.types.INT }
    ];

    self.model.query('SEL_PLANTILLADETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = busqueda;