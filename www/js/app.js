// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    /*
    if (window.cordova) {
      db = window.sqlitePlugin.openDatabase( {name: "my.db", createFromLocation: 1} );
       //device
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS checklist (controller text primary key, id integer unqiue, valid integer)");
    } else {
      db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
      db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS checklist (controller text primary key, id integer unqiue, valid integer)");
      });
    }
    */
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("myapp.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("myapp.db", "1.0", "My app", -1);
    }
    //$cordovaSQLite.execute(db, "DROP TABLE checklist");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS checklist (controller text, id integer, valid integer)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.dscalc', {
    url: "/dscalc",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/calculator.html",
        controller: 'dsCalcCtrl'
      }
    }
  })

  .state('app.dsplay', {
    url: "/dsplay",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/dsplay.html",
        controller: "dsplayCtrl"
      }
    }
  })

  .state('app.dsweapon', {
    url: "/dsweapon",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/KH.html",
        controller: "dsWeaponCtrl"
      }
    }
  })

  .state('app.dspyro', {
    url: "/dspyro",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/pyro.html",
        controller: "dspyroCtrl"
      }
    }
  })

  .state('app.dsspell', {
    url: "/dsspell",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/spell.html",
        controller: "dsspellCtrl"
      }
    }
  })

  .state('app.dspray', {
    url: "/dspray",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/pray.html",
        controller: "dsprayCtrl"
      }
    }
  })

  .state('app.dsbuild', {
    url: "/dsbuild",
    views: {
      'menuContent': {
        templateUrl: "templates/DS/CP.html",
        controller: "dsCPCtrl"
      }
    }
  })

  .state('app.ds2calc', {
    url: "/ds2calc",
    views: {
      'menuContent': {
        templateUrl: "templates/DS2/ds2summonCalc.html",
        controller: "ds2CalcCtrl"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
});
