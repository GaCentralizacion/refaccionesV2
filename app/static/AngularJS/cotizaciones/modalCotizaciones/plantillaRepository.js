var plantillaURL = global_settings.urlCORS + 'api/plantilla/';


registrationModule.factory('plantillaRepository', function($http) {
    return {
        insertPlantilla: function(plantilla) {
            return $http({
                url: plantillaURL + 'insertPlantilla/',
                method: "POST",
                data: plantilla,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updatePlantilla: function(plantilla) {
            return $http({
                url: plantillaURL + 'updatePlantilla/',
                method: "POST",
                data: plantilla,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        deletePlantilla: function(idPlantilla) {
            return $http({
                url: plantillaURL + 'deletePlantilla/',
                method: "POST",
                data: { idPlantilla: idPlantilla },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});