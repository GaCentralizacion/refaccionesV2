var operadorView = require('../views/reference'),
    operadorModel = require('../models/dataAccess')


var operador = function(conf) {
    this.conf = conf || {};

    this.view = new operadorView();
    this.model = new operadorModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

operador.prototype.post_create = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'nombre', value: req.body.nombre, type: self.model.types.STRING },
        { name: 'apellidoPaterno', value:  req.body.apPaterno, type: self.model.types.STRING },
        { name: 'apellidoMaterno', value: req.body.apMaterno, type: self.model.types.STRING },
        { name: 'telefono', value: req.body.telefono, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT }
      	];
  console.log(params);
    self.model.query('INS_OPERADOR_SP ', params, function(error, result) {
             
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
operador.prototype.post_update = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'idOperador', value: req.body.idOperador, type: self.model.types.INT },
        { name: 'nombre', value: req.body.nombre, type: self.model.types.STRING },
        { name: 'apellidoPaterno', value:  req.body.apPaterno, type: self.model.types.STRING },
        { name: 'apellidoMaterno', value: req.body.apMaterno, type: self.model.types.STRING },
        { name: 'telefono', value: req.body.telefono, type: self.model.types.STRING },
        { name: 'estatu', value: req.body.estatus, type: self.model.types.INT },
        ];
  console.log(params);
    self.model.query('UPD_OPERADOR_SP ', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


operador.prototype.get_operadoresShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_OPERADORES_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = operador;