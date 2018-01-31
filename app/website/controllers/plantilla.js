var plantillaView = require('../views/reference'),
    plantillaModel = require('../models/dataAccess'),
    jsonxml = require('jsontoxml')


var plantilla = function(conf) {
    this.conf = conf || {};

    this.view = new plantillaView();
    this.model = new plantillaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
// Creates a new Cotizacion Plantilla in the DB
plantilla.prototype.post_insertPlantilla = function(req, res, next) {

    var self = this;
    console.log(req.body, 'SOy EL CUERPO DEL DELITO')
    console.log(req.body.refacciones, 'SOY LAS rEFACCIONES')
    for (var i = 0; i < req.body.refacciones.length; i++) {
        req.body.refacciones[i] = {
            refaccion: req.body.refacciones[i]
        }
    }
    var params = [{ name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idCotizacion', value: 0, type: self.model.types.INT },
        {
            name: 'refacciones',
            value: jsonxml({
                refacciones: req.body.refacciones
            }),
            type: self.model.types.STRING
        },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'base', value: req.body.base, type: self.model.types.STRING },
        { name: 'empresa', value: req.body.empresa, type: self.model.types.STRING },
        { name: 'sucursal', value: req.body.sucursal, type: self.model.types.STRING }
    ];
    self.model.query('INS_COTIZACIONPLANTILLA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
// Updates an existing Cotizacion in the DB
plantilla.prototype.post_updatePlantilla = function(req, res, next) {

    var self = this;
    for (var i = 0; i < req.body.refacciones.length; i++) {
        req.body.refacciones[i] = {
            refaccion: req.body.refacciones[i]
        }
    }
    var params = [{ name: 'idCotizacionPlantilla', value: req.body.idCotizacionPlantilla, type: self.model.types.INT },
        {
            name: 'refacciones',
            value: jsonxml({
                refacciones: req.body.refacciones
            }),
            type: self.model.types.STRING
        }
    ];

    self.model.query('UPD_PLANTILLA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
plantilla.prototype.post_deletePlantilla = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idCotizacionPlantilla', value: req.body.idPlantilla, type: self.model.types.INT },
        { name: 'idEstatus', value: 0, type: self.model.types.INT }
    ];

    console.log(params,'PARAMS EN ELIMINAR PLANTILLA ')
    self.model.query('DEL_ESTATUS_PLANTILLA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = plantilla;