var despachoView = require('../views/reference'),
    despachoModel = require('../models/dataAccess'),
    jsonxml = require('jsontoxml')


var despacho = function(conf) {
    this.conf = conf || {};

    this.view = new despachoView();
    this.model = new despachoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

despacho.prototype.post_create = function(req, res, next) {
   var self = this;
      for (var i = 0; i < req.body.direcciones.length; i++) {
        req.body.direcciones[i] = {
            direccion: req.body.direcciones[i]
        }
    }

    var params = [
        { name: 'idRuta', value: req.body.idRuta, type: self.model.types.INT },
        {
            name: 'direcciones',
            value: jsonxml({
                direcciones: req.body.direcciones
            }),
            type: self.model.types.STRING
        }
    ];
   
console.log(params);
    self.model.query('UPD_DESPACHO_SP', params, function(error, result) {
        console.log(result);
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
despacho.prototype.post_update = function(req, res, next) {
   var self = this;
      for (var i = 0; i < req.body.direcciones.length; i++) {
        req.body.direcciones[i] = {
            direccion: req.body.direcciones[i]
        }
    }

    var params = [
        { name: 'idRuta', value: req.body.idRuta, type: self.model.types.INT },
        { name: 'tipo', value: req.body.tipo, type: self.model.types.INT },
        { name: 'situacionRuta', value: req.body.situacionRuta, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'nombreRuta', value: req.body.nombreRuta, type: self.model.types.STRING },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },
        {
            name: 'direcciones',
            value: jsonxml({
                direcciones: req.body.direcciones
            }),
            type: self.model.types.STRING
        }
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
despacho.prototype.get_rutasShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_DESPACHO_PEDIDOS_RUTA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

despacho.prototype.get_catalogoRutas = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_RUTAS_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


despacho.prototype.get_busquedaPedidoUsuarioDEtalle = function(req, res, next) {
   var self = this;

   var params = [
        { name: 'idPedido', value: req.query.pedido, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.usuario, type: self.model.types.INT }
    ];
 
    self.model.query('SEL_PEDIDO_USUARIODETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = despacho;