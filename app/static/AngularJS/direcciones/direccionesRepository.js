var direccionURL = global_settings.urlCORS + 'api/direccion/';


registrationModule.factory('direccionRepository', function($http) {
    return {
        getDirecciones: function(data) {
            return $http({
                url: direccionURL + 'index/',
                method: "GET",
                params: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postCreate: function(direccion) {
            return $http({
                url: direccionURL + 'create/',
                method: "POST",
                data: direccion,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postUpdate: function(direccion) {
            return $http({
                url: direccionURL + 'update/',
                method: "POST",
                data: direccion,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getVendedor: function(dato) {

            return $http({
                url: direccionURL + 'vendedor/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEstado: function(dato) {
            console.log(dato);
            return $http({
                url: direccionURL + 'estado/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getMunicipio: function(dato) {
            return $http({
                url: direccionURL + 'municipio/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCiudad: function(dato) {
            return $http({
                url: direccionURL + 'ciudad/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getColonia: function(dato) {
            return $http({
                url: direccionURL + 'colonia/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCp: function(dato) {
            return $http({
                url: direccionURL + 'cp/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getInformacionCp: function(dato) {
            return $http({
                url: direccionURL + 'informacionCp/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getListCp: function(dato) {
            return $http({
                url: direccionURL + 'listCp/',
                method: "GET",
                params: dato,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDireccionesAll: function() {
            return $http({
                url: direccionURL + 'direccionesAll/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDireccionesRuta: function(idRuta) {
            return $http({
                url: direccionURL + 'direccionesRuta/',
                method: "GET",
                params: { idRuta: idRuta },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        postUpdateDireccion: function(direccion) {
            return $http({
                url: direccionURL + 'updateDireccion/',
                method: "POST",
                data: direccion,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});