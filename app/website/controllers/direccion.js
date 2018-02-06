var direccionView = require('../views/reference'),
    direccionModel = require('../models/dataAccess')

var direccion = function(conf) {
    this.conf = conf || {};

    this.view = new direccionView();
    this.model = new direccionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
// Gets a list of Direccions
direccion.prototype.get_index = function(req, res, next) {
    var self = this;
    var params = [];
    var opcion = req.query.opcion; //1:SEL_DIRECCION_SP, 2:SEL_DIRECCION_CLIENTE_SP
    var stored = (opcion == 1) ? 'SEL_DIRECCION_SP' : (opcion == 2) ? 'SEL_DIRECCION_CLIENTE_SP' : 'SEL_RUTAS_SP';

    params.push({
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.STRING
    })

    params.push({
        name: 'idEmpresa',
        value: req.query.idEmpresa,
        type: self.model.types.STRING
    })

    params.push({
        name: 'idSucursal',
        value: req.query.idSucursal,
        type: self.model.types.STRING
    })

    if (opcion == 2) {
        params.push({
            name: 'idEstatus',
            value: req.query.idEstatus,
            type: self.model.types.STRING
        })

        params.push({
            name: 'role',
            value: req.query.role,
            type: DataAccess.types.STRING
        })
    }

    if (opcion == 3) { //agregar parametro idDireccion
        params.push({
            name: 'idDireccion',
            value: req.query.idDireccion,
            type: self.model.types.STRING
        })
    }


    //console.log(params)
    //console.log(stored)
    self.model.query(stored, params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};
// Gets a single Direccion from the DB
direccion.prototype.get_show = function(req, res, next) {
    var self = this;
    //console.log('show')

    var params = [];
    params.push({
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.STRING
    })
    params.push({
        name: 'idDireccion',
        value: req.query.idDireccion,
        type: self.model.types.STRING
    })

    //console.log('SEL_DIRECCION_CLIENTE_DETALLE_SP')
    //console.log(params)

    self.model.query('SEL_DIRECCION_CLIENTE_DETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
// Gets a list of Direccions from the DB
direccion.prototype.get_list = function(req, res, next) {
    var self = this;
    //console.log('list')
    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idEstatus', value: req.query.idEstatus, type: self.model.types.INT }
    ];

    //console.log('SEL_DIRECCION_CLIENTE_SP')
    //console.log(params)
    self.model.query('SEL_DIRECCION_CLIENTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
// Creates a new Direccion in the DB
direccion.prototype.post_create = function(req, res, next) {
    var self = this;
    //console.log('guarda direccion server')
    var params = [{ name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.body.idSucursal, type: self.model.types.INT },
        { name: 'estado', value: req.body.estado, type: self.model.types.STRING },
        { name: 'ciudad', value: req.body.ciudad, type: self.model.types.STRING },
        { name: 'municipio', value: req.body.municipio, type: self.model.types.STRING },
        { name: 'colonia', value: req.body.colonia, type: self.model.types.STRING },
        { name: 'cp', value: req.body.cp, type: self.model.types.STRING },
        { name: 'calle', value: req.body.calle, type: self.model.types.STRING },
        { name: 'exterior', value: req.body.exterior, type: self.model.types.STRING },
        { name: 'interior', value: req.body.interior, type: self.model.types.STRING },
        { name: 'referencia', value: req.body.referencia, type: self.model.types.STRING },
        { name: 'nombre1', value: req.body.nombre1, type: self.model.types.STRING },
        { name: 'apaterno1', value: req.body.apaterno1, type: self.model.types.STRING },
        { name: 'amaterno1', value: req.body.amaterno1, type: self.model.types.STRING },
        { name: 'rfc1', value: req.body.rfc1, type: self.model.types.STRING },
        { name: 'lada1', value: req.body.lada1, type: self.model.types.STRING },
        { name: 'tel1_1', value: req.body.tel1_1, type: self.model.types.STRING },
        { name: 'tel2_1', value: req.body.tel2_1, type: self.model.types.STRING },
        { name: 'correo1', value: req.body.correo1, type: self.model.types.STRING },
        { name: 'nombre2', value: req.body.nombre2, type: self.model.types.STRING },
        { name: 'apaterno2', value: req.body.apaterno2, type: self.model.types.STRING },
        { name: 'amaterno2', value: req.body.amaterno2, type: self.model.types.STRING },
        { name: 'rfc2', value: req.body.rfc2, type: self.model.types.STRING },
        { name: 'lada2', value: req.body.lada2, type: self.model.types.STRING },
        { name: 'tel1_2', value: req.body.tel1_2, type: self.model.types.STRING },
        { name: 'tel2_2', value: req.body.tel2_2, type: self.model.types.STRING },
        { name: 'correo2', value: req.body.correo2, type: self.model.types.STRING },
        { name: 'correoGeneral', value: req.body.correoGeneral, type: self.model.types.STRING },
        { name: 'comprobante', value: req.body.comprobante, type: self.model.types.INT }
    ];

    //console.log('SEL_DIRECCION_CLIENTE_SP')
    //console.log(params)
    self.model.query('SEL_DIRECCION_CLIENTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = direccion;