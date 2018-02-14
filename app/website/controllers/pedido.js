var pedidoView = require('../views/reference'),
    pedidoModel = require('../models/dataAccess')


var pedido = function(conf) {
    this.conf = conf || {};

    this.view = new pedidoView();
    this.model = new pedidoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

pedido.prototype.get_busquedaPedido = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idUsuario', value: req.query.tipo, type: self.model.types.INT },
        { name: 'estatus', value: 1, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.empresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.sucursal, type: self.model.types.INT },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING }
    ];
     console.log(params);
    self.model.query('SEL_PEDIDO_USUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
},
pedido.prototype.get_busquedaPedidoUsuarioDEtalle = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idPedido', value: req.query.pedido, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.usuario, type: self.model.types.INT }
    ];
     console.log(params);
    self.model.query('SEL_PEDIDO_USUARIODETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
},
pedido.prototype.post_reportePdf = function(req, res, next) {
    var filename = guid();
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";
    console.log(path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf");
    var options = {
        "method": "POST",
        "hostname": "192.168.20.89",
        "port": "5488",
        "path": "/api/report",
        "headers": {
            "content-type": "application/json"
        }
    };
    var request = http.request(options, function(response) {
        var chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function() {
            var body = Buffer.concat(chunks);

            fs.writeFile(filePath, body, function(err) {
                if (err) return console.log(err);
            });

        });
    });
    request.write(JSON.stringify(req.body.values));
    request.end();
    var self = this;
    self.view.expositor(res, {
        error: null,
        result: filename
    });
};
pedido.prototype.post_create = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idCotizacion', value: req.body.idCotizacion, type: self.model.types.INT },
        { name: 'idPersona', value: req.body.idPersona, type: self.model.types.INT },
        { name: 'RTD_CONSEC', value: req.body.concecutivo, type: self.model.types.INT },
        { name: 'RTD_RTENTREGA', value: req.body.entrega, type: self.model.types.STRING },
        { name: 'operacion', value: req.body.operacion, type: self.model.types.INT },
        { name: 'idPedidoRef', value: req.body.idPedido, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT }
    ];
     console.log(params);

    self.model.queryAll('INS_PEDIDO_SP', params, function(error, result) {
        console.log(error, 'SOY EL ERROR')
        console.log(result[1], 'SOY EL RESULT')
        result[0][0].data = result[1];
        console.log(result[0][0])
        self.view.expositor(res, {
            error: error,
            result: result[0][0]
        });
    });
};
module.exports = pedido;
