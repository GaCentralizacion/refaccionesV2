var unidadView = require('../views/reference'),
    unidadModel = require('../models/dataAccess')


var unidad = function(conf) {
    this.conf = conf || {};

    this.view = new unidadView();
    this.model = new unidadModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

unidad.prototype.post_create = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'numSerie', value: req.body.numserie, type: self.model.types.STRING },
        { name: 'idMarca', value:  req.body.idMarca, type: self.model.types.STRING },
        { name: 'modelo', value: req.body.modelo, type: self.model.types.STRING },
        { name: 'color', value: req.body.color, type: self.model.types.STRING },
        { name: 'placas', value: req.body.placas, type: self.model.types.STRING },
        { name: 'idTipoCarga', value: req.body.idTipoCarga, type: self.model.types.INT },
        { name: 'capacidad', value: req.body.capacidad, type: self.model.types.STRING },
        { name: 'metrosCubicos', value: req.body.metrosCubicos, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'anio', value: req.body.anio, type: self.model.types.STRING },
        { name: 'pesoUnidad', value: req.body.peso, type: self.model.types.STRING },
        ];

    self.model.query('INS_UNIDAD_SP', params, function(error, result) {
                 console.log('error:::')
        console.log(error)
        console.log('result:::')
        console.log(result)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
unidad.prototype.post_update = function(req, res, next) {
   var self = this;


    var params = [
        { name: 'numSerie', value: req.body.numserie, type: self.model.types.STRING },
        { name: 'idMarca', value:  req.body.idMarca, type: self.model.types.STRING },
        { name: 'modelo', value: req.body.modelo, type: self.model.types.STRING },
        { name: 'color', value: req.body.color, type: self.model.types.STRING },
        { name: 'placas', value: req.body.placas, type: self.model.types.STRING },
        { name: 'idTipoCarga', value: req.body.idTipoCarga, type: self.model.types.INT },
        { name: 'capacidad', value: req.body.capacidad, type: self.model.types.STRING },
        { name: 'metrosCubicos', value: req.body.metrosCubicos, type: self.model.types.STRING },
        { name: 'idUnidad', value: req.body.idUnidad, type: self.model.types.INT },
        { name: 'estatu', value: req.body.estatus, type: self.model.types.INT },
        { name: 'anio', value: req.body.anio, type: self.model.types.STRING },
        { name: 'pesoUnidad', value: req.body.peso, type: self.model.types.STRING },
        ];
  console.log(params);
    self.model.query('UPD_UNIDAD_SP', params, function(error, result) {
    console.log('error:::')
        console.log(error)
        console.log('result:::')
        console.log(result)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


unidad.prototype.get_unidadesShow = function(req, res, next) {
   var self = this;

    var params = [  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}];
 
    self.model.query('SEL_UNIDADES_SP ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

unidad.prototype.get_marcas = function(req, res, next) {
   var self = this;
 
  
    self.model.query('SEL_MARCAS_SP ', true, function(error, result) {

      
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

unidad.prototype.get_tipoUnidades = function(req, res, next) {
   var self = this;
  //  var params = [  { name: 'idEmpresa', value: 1, type: self.model.types.INT}];
 // console.log('llega:::')
    self.model.query('SEL_TIPO_CARGA_SP ', true ,function(error, result) {
        //   console.log('error:::')
        // console.log(error)
        // console.log('result:::')
        // console.log(result)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


unidad.prototype.get_pesoUni = function(req, res, next) {
   var self = this;
 
  
    self.model.query('SEL_PESO_UNIDAD_SP', true, function(error, result) {
console.log(error)
      
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = unidad;