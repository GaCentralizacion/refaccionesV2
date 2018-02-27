var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning', 'ui.grid.edit'])
    .config(function($routeProvider, $locationProvider) {

        /*cheange the routes*/
        $routeProvider.when('/', {
            templateUrl: 'AngularJS/Templates/login.html',
            controller: 'loginController'
        });
        $routeProvider.when('/cotizaciones', {
            templateUrl: 'AngularJS/Templates/cotizaciones.html',
            controller: 'cotizacionesController'
        });
        $routeProvider.when('/pedido', {
            templateUrl: 'AngularJS/Templates/pedido.html',
            controller: 'pedidoController'
        });
        $routeProvider.when('/historial', {
            templateUrl: 'AngularJS/Templates/historial.html',
            controller: 'historialController'
        });
         $routeProvider.when('/direccion', {
            templateUrl: 'AngularJS/Templates/direccion.html',
            controller: 'direccionesController'
        });
        $routeProvider.when('/aprobacion', {
            templateUrl: 'AngularJS/Templates/aprobacion.html',
            controller: 'aprobacionController'
        });
         $routeProvider.when('/operador', {
            templateUrl: 'AngularJS/Templates/operador.html',
            controller: 'operadorController'
        });
        $routeProvider.when('/unidad', {
            templateUrl: 'AngularJS/Templates/unidad.html',
            controller: 'unidadController'
        });
         $routeProvider.when('/ruta', {
            templateUrl: 'AngularJS/Templates/ruta.html',
            controller: 'rutaController'
        });

        $routeProvider.when('/despacho', {
            templateUrl: 'AngularJS/Templates/despacho.html',
            controller: 'despachoController'
        });

          $routeProvider.when('/direccionv2', {
            templateUrl: 'AngularJS/Templates/direccionv2.html',
            controller: 'direccionesController'
        });


        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed
        });
        changeHeight(); // when page loads
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
