var db = null;

angular.module('starter.controllers', [])
// modled by lally elias https://gist.github.com/lykmapipo/6451623a54ef9b957a5c
.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function(query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function() {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function(result) {
          q.resolve(result);
        }, function(error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      var a = result.rows.item(i);
      if (a.valid) {
        a.valid = true;
      } else {
        a.valid = false;
      }
      output.push(a);
    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})

// modled based on lally elias https://gist.github.com/lykmapipo/6451623a54ef9b957a5c
.factory('Items', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function(controllerLoc) {
    var parameters = [controllerLoc];
    return DBA.query("SELECT valid FROM checklist WHERE controller = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.get = function(controller, memberId) {
    var parameters = [controller, memberId];
    return DBA.query("SELECT valid FROM checklist WHERE controller = (?) AND id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(controller, memberId) {
    var parameters = [controller, memberId];
    return DBA.query("INSERT INTO checklist (controller, id, valid) VALUES (?,?, 0)", parameters);
  }

  self.remove = function(controller, memberId) {
    var parameters = [controller, memberId];
    return DBA.query("DELETE FROM checklist WHERE controller = (?) AND id = (?)", parameters);
  }

  self.update = function(controller, memberId, valid) {
    var parameters = [valid, memberId, controller];
    return DBA.query("UPDATE checklist SET valid = (?) WHERE id = (?) AND controller = (?)", parameters);
  }

  return self;
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('dsCalcCtrl', ['$scope', function($scope) {
  $scope.Math = window.Math;
  $scope.dscalculate = function(dslevel) {
    if (dslevel > 713) {
      dslevel = 713;
    }
    if (dslevel < 1) {
      dslevel = 1;
    }
    $scope.dserange = 10;
    $scope.dserange += parseInt(dslevel) / 10;
    $scope.dsrmin = $scope.Math.floor(parseInt(dslevel) - $scope.dserange);
    $scope.dsrmax = $scope.Math.floor(parseInt(dslevel) + $scope.dserange);
    if ($scope.dsrmin < 1) {
      $scope.dsrmin = 1;
    }
    if ($scope.dsrmax > 713) {
      $scope.dsrmax = 713;
    }
  };
}])

.controller('ds2CalcCtrl', ['$scope', function($scope) {
  $scope.Math = window.Math;
  $scope.items = [
    {item: "White Sign Soapstone",        tierDown: 1, tierUp: 3, ring: true},
    {item: "Small White Sign Soapstone",  tierDown: 2, tierUp: 4, ring: true},
    {item: "Cracked Red Eye Orb",         tierDown: 4, tierUp: 0, ring: false},
    {item: "Cracked Blue Eye Orb",        tierDown: 3, tierUp: 3, ring: false },
    {item: "Dragon Eye",                  tierDown: 5, tierUp: 5, ring: false },
    {item: "Crest of the Rat",            tierDown: 1, tierUp: 3, ring: false },
    {item: "Bell Keeper's Seal",          tierDown: 3, tierUp: 1, ring: false },
    {item: "Gaurdain's Seal",             tierDown: 4, tierUp: 5, ring: false },
    {item: "Red Sign Soapstone",          tierDown: 2, tierUp: 5, ring: false }
  ];
  $scope.tool = $scope.items[0];
  $scope.min = 0;
  $scope.minring = 0;
  $scope.max = 10000;
  $scope.maxring = 40000;
  $scope.ds2calculate = function(ds2Mem, tool) {
    var tier = [0, 10000, 20000, 30000, 40000, 50000, 70000, 90000, 110000, 130000, 150000,
                180000, 210000, 240000, 270000, 300000, 350000, 400000, 450000, 500000,
                600000, 700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000,
                1750000, 2000000, 2250000, 2500000, 2750000, 3000000, 5000, 7000000, 9000000, 12000000, 15000000, 20000000,
                30000000, 45000000, 360000000, 999999999
              ];
    var tierIndex = -1;
    for (var i = 0; i < tier.length && tierIndex < 0; i++) {
      if (tier[i] <= ds2Mem && ds2Mem < tier[i+1]){
          tierIndex = i;
      }
    }

    var tiersMin = tierIndex - tool.tierDown;
    if (tiersMin < 0){
      $scope.min = 0;
      $scope.minring = 0;
    }
    else if (tiersMin < 0) {
      $scope.minring = 0;
    }
    else {
      $scope.min = tier[tiersMin];
      $scope.minring = tier[tiersMin - 3];
    }

    var tiersMax = tierIndex + tool.tierUp + 1;
    if (tiersMax > tier.length) {
      $scope.max = "999999999+";
      $scope.maxring = "999999999+";
    }
    else if (tiersMax + 3 > tier.length) {
      $scope.maxring = "999999999+";
    }
    else {
          $scope.max = tier[tiersMax];
          $scope.maxring = tier[tiersMax + 3];
    }

  };
}])

.controller('dsCPCtrl', ['$scope', function($scope) {
  $scope.initial = [
    { startclass: "warrior",      baseVT: 11, baseAT: 8,  baseEN: 12, baseSTR: 13, baseDX: 13, baseINT: 9,  baseRES: 11, baseFAT: 9,  baseLVL: 4},
    { startclass: "knight",       baseVT: 14, baseAT: 10, baseEN: 10, baseSTR: 11, baseDX: 11, baseINT: 9,  baseRES: 10, baseFAT: 11, baseLVL: 5},
    { startclass: "wanderer",     baseVT: 10, baseAT: 11, baseEN: 10, baseSTR: 10, baseDX: 14, baseINT: 11, baseRES: 12, baseFAT: 8,  baseLVL: 3},
    { startclass: "thief",        baseVT:  9, baseAT: 11, baseEN:  9, baseSTR: 9,  baseDX: 15, baseINT: 12, baseRES: 10, baseFAT: 11, baseLVL: 5},
    { startclass: "bandit",       baseVT: 12, baseAT: 8,  baseEN: 14, baseSTR: 14, baseDX: 9,  baseINT: 8,  baseRES: 11, baseFAT: 10, baseLVL: 4},
    { startclass: "hunter",       baseVT: 11, baseAT: 9,  baseEN: 11, baseSTR: 12, baseDX: 14, baseINT: 9,  baseRES: 11, baseFAT: 9,  baseLVL: 4},
    { startclass: "pyromancer",   baseVT: 10, baseAT: 12, baseEN: 11, baseSTR: 12, baseDX: 9,  baseINT: 10, baseRES: 12, baseFAT: 8,  baseLVL: 1},
    { startclass: "sorcerer",     baseVT:  8, baseAT: 15, baseEN:  8, baseSTR: 9,  baseDX: 11, baseINT: 15, baseRES: 11, baseFAT: 8,  baseLVL: 3},
    { startclass: "cleric",       baseVT: 11, baseAT: 11, baseEN:  9, baseSTR: 12, baseDX: 8,  baseINT: 8,  baseRES: 11, baseFAT: 14, baseLVL: 2},
    { startclass: "deprived",     baseVT: 11, baseAT: 11, baseEN: 11, baseSTR: 11, baseDX: 11, baseINT: 11, baseRES: 11, baseFAT: 11, baseLVL: 6}
  ];
  $scope.arrows = [
    {arrow: "Wooden", dmg: 35, Fire: 0, Magic: 0},
    {arrow: "Large", dmg: 60, Fire: 0, Magic: 0},
    {arrow: "Standard", dmg: 45, Fire: 0, Magic: 0},
    {arrow: "Feather", dmg: 50, Fire: 0, Magic: 0},
    {arrow: "Fire", dmg: 35, Fire: 50, Magic: 0},
    {arrow: "Poison", dmg: 42, Fire: 0, Magic: 0},
    {arrow: "Moonlight", dmg: 0, Fire: 0, Magic: 80},
    {arrow: "Dragonslayer", dmg: 100, Fire: 0, Magic: 0},
    {arrow: "Gough", dmg: 105, Fire: 0, Magic: 0}
  ];
  $scope.arrow = $scope.arrows[0];
  $scope.weapons = [
    { weapon: "Sunlight Straight Sword", type: "Normal",
      damage: { _1: 82, _2: 0, _3: 0, _4: 0 },
      scale:  { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Barbed Straight Sword", type: "Normal",
      damage: { _1: 80,      _2: 0,      _3: 0,      _4: 0 },
      scale:  { str: .25,      dex: .25,      fth: 0, int: 0    }
    },
    { weapon: "Darksword", type: "Normal",
      damage: { _1: 82, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Straight Sword Hilt", type: "Normal",
      damage: { _1: 20, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Bastard Sword", type: "Normal",
      damage: { _1: 105, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Claymore", type: "Normal",
      damage: { _1: 103, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Man-Serpent Greatsword", type: "Normal",
      damage: { _1: 110, _2: 0, _3: 0, _4: 0 },
      scale: { str: 1, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Flamberge", type: "Normal",
      damage: { _1: 100, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Zweihander", type: "Normal",
      damage: { _1: 130, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Greatsword", type: "Normal",
      damage: { _1: 130, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Demon Great Machete", type: "Normal",
      damage: { _1: 133, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Scimitar", type: "Normal",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Falchion", type: "Normal",
      damage: { _1: 82, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Shotel", type: "Normal",
      damage: { _1: 82, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Painting Guardian Sword", type: "Normal",
      damage: { _1: 76, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: 1, fth: 0, int: 0 }
    },
    { weapon: "Server", type: "Normal",
      damage: { _1: 107, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Murakumo", type: "Normal",
      damage: { _1: 113, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Uchigatana", type: "Normal",
      damage: { _1: 90, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Washing Pole", type: "Normal",
      damage: { _1: 90, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Iaito", type: "Normal",
      damage: { _1: 88, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Mail Breaker", type: "Normal",
      damage: { _1: 57, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Rapier", type: "Normal",
      damage: { _1: 73, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Estoc", type: "Normal",
      damage: { _1: 75, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Ricard's Rapier", type: "Thrusting Sword",
      damage: { _1: 70, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Hand Axe", type: "Axe",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Battle Axe", type: "Axe",
      damage: { _1: 95, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Butcher Knife", type: "Axe",
      damage: { _1: 90, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Gargoyle Tail Axe", type: "Axe",
      damage: { _1: 93, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Greataxe", type: "Greataxe",
      damage: { _1: 140, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Demons Greataxe", type: "Greataxe",
      damage: { _1: 114, _2: 0, _3: 0, _4: 0 },
      scale: { str: 1, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Club", type: "Hammer",
      damage: { _1: 87, _2: 0, _3: 0, _4: 0 },
      scale: { str: 1, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Mace", type: "Hammer",
      damage: { _1: 91, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Morning Star", type: "Hammer",
      damage: { _1: 83, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "War Pick", type: "Hammer",
      damage: { _1: 91, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Pickaxe", type: "Hammer",
      damage: { _1: 89, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Reinforced Club", type: "Hammer",
      damage: { _1: 97, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Blacksmith Hammer", type: "Hammer",
      damage: { _1: 87, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Great Club", type: "Normal",
      damage: { _1: 135, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Demons Great Hammer", type: "Normal",
      damage: { _1: 138, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Large Club", type: "Normal",
      damage: { _1: 120, _2: 0, _3: 0, _4: 0 },
      scale: { str: 1, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Spear", type: "Normal",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Winged Spear", type: "Normal",
      damage: { _1: 86, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Partizan", type: "Normal",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Pike", type: "Normal",
      damage: { _1: 86, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Halberd", type: "Normal",
      damage: { _1: 110, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 } },
    { weapon: "Gargoyle's Halberd", type: "Normal",
      damage: { _1: 115, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Lucerne", type: "Normal",
      damage: { _1: 110, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Scythe", type: "Normal",
      damage: { _1: 110, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Great Scythe", type: "Normal",
      damage: { _1: 100, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Whip", type: "Normal",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Notched Whip", type: "Normal",
      damage: { _1: 76, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Dragon Bone Fist", type: "Normal",
      damage: { _1: 95, _2: 0, _3: 0, _4: 0 },
      scale: { str: 1, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Dark Hand", type: "Normal",
      damage: { _1: 200, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Ghost Blade", type: "Dagger",
      damage: { _1: 110, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Priscilla's Dagger", type: "Dagger",
      damage: { _1: 80, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 1.4, fth: 0, int: 0 }
    },
    { weapon: "Crystal Straight Sword", type: "Normal",
      damage: { _1: 145, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Silver Knight Straight Sword", type: "Normal",
      damage: { _1: 175, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Astora's Straight Sword", type: "Normal",
      damage: { _1: 80, _2: 80, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: .5, int: 0 }
    },
    { weapon: "Drake Sword", type: "Normal",
      damage: { _1: 200, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Crystal Greatsword", type: "Normal",
      damage: { _1: 180, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Black Knight Sword", type: "Normal",
      damage: { _1: 220, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Stone Greatsword", type: "Normal",
      damage: { _1: 148, _2: 100, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: .01 }
    },
    { weapon: "Cursed Greatsword of Artorias", type: "Normal",
      damage: { _1: 158, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: .5, int: .5 }
    },
    { weapon: "Greatsword of Artorias", type: "Normal",
      damage: { _1: 120, _2: 85, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: .75, int: .75 }
    },
    { weapon: "Great Lord Greatsword", type: "Normal",
      damage: { _1: 231, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Moonlight Greatsword", type: "Normal",
      damage: { _1: 0, _2: 132, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 1 }
    },
    { weapon: "Black Knight Greatsword", type: "Normal",
      damage: { _1: 220, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Dragon Greatsword", type: "Normal",
      damage: {_1: 390,_2: 0,_3: 0,_4: 0 },
      scale: {str: 0,dex: 0,fth: 0,int: 0 }
    },
    { weapon: "Velkas Rapier", type: "Normal",
      damage: {_1: 62,_2: 104,_3: 0,_4: 0 },
      scale: {str: .01,dex: .5,fth: 0,int: .75 }
    },
    { weapon: "Chaos Blade", type: "Normal",
      damage: {_1: 144,_2: 0,_3: 0,_4: 0 },
      scale: {str: 0,dex: .75,fth: 0,int: 0 }
    },
    { weapon: "GravelordSword", type: "Normal",
      damage: {_1: 265,_2: 0,_3: 0,_4: 0 },
      scale: {str: .01,dex: .01,fth: 0, int: 0 }
    },
    { weapon: "Quelaag's Furysword", type: "Normal",
      damage: { _1: 60, _2: 0, _3: 170, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Golem Axe", type: "Normal",
      damage: { _1: 170, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Black Knight Greataxe", type: "Normal",
      damage: { _1: 229, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Dragon King Greataxe", type: "Normal",
      damage: { _1: 380, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Blacksmith Giant Hammer", type: "Normal",
      damage: { _1: 120, _2: 0, _3: 0, _4: 200 },
      scale: { str: .25, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Hammer of Vamos", type: "Normal",
      damage: { _1: 115, _2: 0, _3: 64, _4: 0 },
      scale: { str: .5, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Grant", type: "Normal",
      damage: { _1: 130, _2: 130, _3: 0, _4: 0 },
      scale: { str: .75, dex: 0, fth: 1, int: 0 }
    },
    { weapon: "Dragon Tooth", type: "Normal",
      damage: { _1: 290, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Smough's Hammer", type: "Normal",
      damage: { _1: 300, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Channeler's Trident", type: "Normal",
      damage: { _1: 70, _2: 115, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: .75 }
    },
    { weapon: "Demon's Spear", type: "Normal",
      damage: { _1: 100, _2: 0, _3: 0, _4: 120 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Silver Knight Spear", type: "Normal",
      damage: { _1: 163, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Moonlight Butterfly Horn", type: "Normal",
      damage: { _1: 0, _2: 120, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: .75 }
    },
    { weapon: "Dragonslayer Spear", type: "Normal",
      damage: { _1: 95, _2: 0, _3: 0, _4: 65 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Giants Halberd", type: "Normal",
      damage: { _1: 140, _2: 0, _3: 0, _4: 135 },
      scale: { str: .25, dex: .25, fth: 0, int: 0 }
    },
    { weapon: "Titanite Catch Pole", type: "Normal",
      damage: { _1: 125, _2: 145, _3: 0, _4: 0 },
      scale: { str: .25, dex: .25, fth: 0, int: .25 }
    },
    { weapon: "Black Knight Halberd", type: "Normal",
      damage: { _1: 245, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Lifehunt Scythe", type: "Normal",
      damage: { _1: 180, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: .75, fth: 0, int: 0 }
    },
    { weapon: "Darkmoon Bow", type: "Bow",
      damage: { _1: 85, _2: 85, _3: 0, _4: 0 },
      scale: { str: .01, dex: .25, fth: .25, int: 0 }
    },
    { weapon: "Dragonslayer Greatbow", type: "Bow",
      damage: { _1: 90, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Short Bow", type: "Bow",
      damage: { _1: 31, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: 1, fth: 0, int: 0 }
    },
    { weapon: "Composite Bow", type: "Bow",
      damage: { _1: 55, _2: 0, _3: 0, _4: 0},
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Longbow", type: "Bow",
      damage: { _1: 36, _2: 0, _3: 0, _4: 0},
      scale: { str: .25, dex: 1, fth: 0, int: 0 }
    },
    { weapon: "Black Bow of Pharis", type: "Bow",
      damage: { _1: 34, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: 1.4, fth: 0, int: 0 }
    },
    { weapon: "Light Crossbow", type: "Crossbow",
      damage: { _1: 50, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Heavy Crossbow", type: "Crossbow",
      damage: { _1: 55, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Sniper Crossbow", type: "Crossbow",
      damage: { _1: 52, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Avelyn", type: "Crossbow",
      damage: { _1: 37, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Dark Silver Tracer", type: "Dagger",
      damage: { _1: 75, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: 1.4, fth: 0, int: 0 }
    },
    { weapon: "Abyss Greatsword", type: "Normal",
      damage: { _1: 160, _2: 0, _3: 0, _4: 0 },
      scale: { str: .5, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Obsidian Greatsword", type: "Normal",
      damage: { _1: 320, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    },
    { weapon: "Gold Tracer", type: "Normal",
      damage: { _1: 130, _2: 0, _3: 0, _4: 0 },
      scale: { str: .01, dex: 1, fth: 0, int: 0 }
    },
    { weapon: "Stone Greataxe", type: "Normal",
      damage: { _1: 190, _2: 0, _3: 0, _4: 0 },
      scale: { str: .75, dex: .01, fth: 0, int: 0 }
    },
    { weapon: "Four Pronged Plow", type: "Normal",
      damage: { _1: 75, _2: 0, _3: 0, _4: 0 },
      scale: { str: .25, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Guardian Tail", type: "Normal",
      damage: { _1: 84, _2: 0, _3: 0, _4: 0 },
      scale:  { str: 0, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Goughs Greatbow", type: "Bow",
      damage: { _1: 85, _2: 0,  _3: 0, _4: 0 },
      scale:  { str: .75, dex: .5, fth: 0, int: 0 }
    },
    { weapon: "Skull Lantern", type: "Normal",
      damage: { _1: 0, _2: 0, _3: 0, _4: 0 },
      scale: { str: 0, dex: 0, fth: 0, int: 0 }
    }
  ];
  $scope.weapon = $scope.weapons[0];
  $scope.build = $scope.initial[0];
  $scope.cHP = 384;
  $scope.cATS = 0;
  $scope.cEL = 40;
  $scope.cSTA = 59;
  $scope.phisical = 21;
  $scope.lightning = 21;
  $scope.magic = 21;
  $scope.cVT = $scope.build.baseVT;
  $scope.cAT = $scope.build.baseAT;
  $scope.cEN = $scope.build.baseEN;
  $scope.cSTR = $scope.build.baseSTR;
  $scope.cDX = $scope.build.baseDX;
  $scope.cRES = $scope.build.baseRES;
  $scope.cINT = $scope.build.baseINT;
  $scope.cFAT = $scope.build.baseFAT;
  $scope.damage = 0;
  $scope.updateBase = function(build){
    console.log("in update");
    if (parseInt($scope.cVT) < parseInt(build.baseVT)) {
      $scope.cVT = build.baseVT;
    }
    if (parseInt($scope.cAT) < parseInt(build.baseAT)) {
      $scope.cAT = build.baseAT;
    }
    if (parseInt($scope.cEN )< parseInt(build.baseEN)) {
      console.log("Triggered")
      $scope.cEN = build.baseEN;
    }
    if (parseInt($scope.cSTR) < parseInt(build.baseSTR)) {
      $scope.cSTR = build.baseSTR;
    }
    if (parseInt($scope.cDX) < parseInt(build.baseDX)) {
      $scope.cDX = build.baseDX;
    }
    if (parseInt($scope.cRES) < parseInt(build.baseRES)) {
      $scope.cRES = build.baseRES;
    }
    if (parseInt($scope.cINT) < parseInt(build.baseINT)) {
      $scope.cINT = build.baseINT;
    }
    if (parseInt($scope.cFAT) < parseInt(build.baseFAT)) {
      $scope.cFAT = build.baseFAT;
    }
  };
  $scope.calculate = function(cvt, cat, cen, cstr, cdx, cres, cint, cfat) {
    $scope.Math = window.Math;
    <!-- VT  -->
    var tempHP = 384;
    if (cvt > 99) {
      cvt = 99;
    }
    var tempVT = cvt;
    while (tempVT > 45) {
      tempHP += 12.5;
      tempVT--;
    }
    while (tempVT > 1) {
      tempHP += 731 / 31;
      tempVT--;
    }
    $scope.cHP = $scope.Math.floor(tempHP);
    <!-- AT  //Correct -->
    if (cat > 49) {
      $scope.cATS = 10;
    } else if (cat > 40) {
      $scope.cATS = 9;
    } else if (cat > 33) {
      $scope.cATS = 8;
    } else if (cat > 27) {
      $scope.cATS = 7;
    } else if (cat > 22) {
      $scope.cATS = 6;
    } else if (cat > 18) {
      $scope.cATS = 5;
    } else if (cat > 15) {
      $scope.cATS = 4;
    } else if (cat > 13) {
      $scope.cATS = 3;
    } else if (cat > 11) {
      $scope.cATS = 2;
    } else if (cat > 9) {
      $scope.cATS = 1;
    }
    <!-- EN  -->
    var tempEL = 41;
    tempEL += cen;
    $scope.cEL = tempEL;
    if (cen >= 40) {
      $scope.cSTA = 160;
    } else {
      var tempSTA = 74;
      for (var i = 0; i < cen; i++) {
        tempSTA += 1.8;
      }
      $scope.cSTA = $scope.Math.floor(tempSTA);
    }

    <!-- STR -->
    <!-- DX  -->
    <!-- RES -->
    <!-- INT -->
    <!-- FAT -->
    <!-- LVL -->
    var tempLVL = cvt + cat + cen + cstr + cdx + cres + cint + cfat - ($scope.build.baseVT + $scope.build.baseAT + $scope.build.baseEN + $scope.build.baseSTR + $scope.build.baseDX + $scope.build.baseINT + $scope.build.baseRES + $scope.build.baseFAT);
    tempLVL *= 103 / 87;
    $scope.phisical = $scope.Math.floor(tempLVL + 20);
    if ($scope.phisical > 200) {
      $scope.phisical = 200;
    }
    $scope.lightning = $scope.Math.floor(tempLVL + 20);
    if ($scope.lightning > 200) {
      $scope.lightning = 200;
    }
    $scope.magic = $scope.Math.floor(tempLVL + 20);
    if ($scope.magic > 200) {
      $scope.magic = 200;
    }
  };
  $scope.calculate2 = function(cSTR, cDX, cINT, cFAT, weapon, arrow){
    var basePhs = parseInt(weapon.damage._1);
    if(weapon.type == "Bow" || weapon.type == "Crossbow"){
      basePhs += arrow.dmg;
    }
    var strRating = 0;
    if(cSTR > 40){
      for (var i = 40; i < cSTR; i++) {
        strRating += .0025;
      }
      strRating += .85;
    }
    else if (cSTR > 20) {
      for (var i = 20; i < cSTR; i++) {
        strRating += .0225;
      }
      strRating += .4;
    }
    else if (cSTR > 10){
      for (var i = 10; i < cSTR; i++) {
        strRating += .035;
      }
      strRating += .05;
    }
    var strBonus = strRating * basePhs * parseInt(weapon.scale.str);
    <!--  -->
    var dexRating = 0;
    if(cDX > 40){
      for (var i = 40; i < cDX; i++) {
        dexRating += .0025;
      }
      dexRating += .85;
    }
    else if (cDX > 20) {
      for (var i = 20; i < cDX; i++) {
        dexRating += .0225;
      }
      dexRating += .4;
    }
    else if (cDX > 10){
      for (var i = 10; i < cDX; i++) {
        dexRating += .035;
      }
      dexRating += .05;
    }
    var dexBonus = dexRating * basePhs * parseInt(weapon.scale.dex);
    <!-- Faith -->
    var fatRating = 0;
    if(cFAT > 50){
      for (var i = 40; i < cFAT; i++) {
        fatRating += .0025;
      }
      fatRating += .8;
    }
    else if (cFAT > 30) {
      for (var i = 20; i < cFAT; i++) {
        fatRating += .015;
      }
      fatRating += .5;
    }
    else if (cFAT > 10){
      for (var i = 10; i < cFAT; i++) {
        fatRating += .0225;
      }
      fatRating += .05;
    }
    var fatBonus = fatRating * weapon.damage._4 * parseInt(weapon.scale.fth);

    <!-- -->
    var baseMag = weapon.damage._2;
    if(weapon.type == "Bow" || weapon.type == "Crossbow"){
      baseMag += arrow.Magic;
    }
    var intRating = 0;
    if(cINT > 50){
      for (var i = 40; i < cINT; i++) {
        intRating += .0041;
      }
      intRating += .8;
    }
    else if (cINT > 30) {
      for (var i = 20; i < cINT; i++) {
        intRating += .015;
      }
      intRating += .5;
    }
    else if (cINT > 10){
      for (var i = 10; i < cINT; i++) {
        intRating += .0225;
      }
      intRating += .05;
    }
    var intBonus = intRating * baseMag * parseInt(weapon.scale.int);

    $scope.damage = basePhs + intBonus + fatBonus + strBonus + dexBonus + weapon.damage._3;
    if(weapon.type == "Bow" || weapon.type == "Crossbow"){
      $scope.damage += arrow.Fire;
    }
  }
  $scope.calculate($scope.build.baseVT, $scope.build.baseAT, $scope.build.baseEN, $scope.build.baseSTR, $scope.build.baseDX, $scope.build.baseRES, $scope.build.baseINT, $scope.build.baseFAT);
  $scope.calculate2($scope.cSTR, $scope.cDX, $scope.cINT, $scope.cFAT, $scope.weapon, $scope.arrow);
}])

.controller('dsWeaponCtrl', ['$scope', '$cordovaSQLite', 'Items', function($scope, $cordovaSQLite, Items) {
  $scope.items = [];
  $scope.items = null;

  $scope.createNewItemsMember = function(member) {
    Items.add("dsWeaponCtrl", member);
    $scope.updateItems();
  };

  $scope.updateItems = function() {
    Items.all("dsWeaponCtrl").then(function(items) {
      $scope.items = items;
    });
  }

  $scope.createNewItemsMember = function(member) {
    Items.add("dsWeaponCtrl", member, 0);
    $scope.updateItems();
  };

  $scope.removeMember = function(member) {
    Items.remove("dsWeaponCtrl", member);
    $scope.updateItems();
  };

  $scope.editMember = function(origMember, editMember) {
    if (editMember) {
      editMember = 1;
    } else {
      editMember = 0;
    }
    Items.update("dsWeaponCtrl", origMember, editMember);
    $scope.updateItems();
  };

  var beenHere = localStorage.getItem("beenHere") || false;
  if (beenHere == false) {
    for (var i = 0; i < 49; i++) {
      $scope.createNewItemsMember(i);
    }
    localStorage.setItem("beenHere", true)
  }

  $scope.updateItems();

}])

.controller('dsspellCtrl', ['$scope', '$cordovaSQLite', 'Items', function($scope, $cordovaSQLite, Items) {
  $scope.items = [];
  $scope.items = null;

  $scope.createNewItemsMember = function(member) {
    Items.add("dsspellCtrl", member);
    $scope.updateItems();
  };

  $scope.updateItems = function() {
    Items.all("dsspellCtrl").then(function(items) {
      $scope.items = items;
    });
  }

  $scope.createNewItemsMember = function(member) {
    Items.add("dsspellCtrl", member, 0);
    $scope.updateItems();
  };

  $scope.removeMember = function(member) {
    Items.remove("dsspellCtrl", member);
    $scope.updateItems();
  };

  $scope.editMember = function(origMember, editMember) {
    if (editMember) {
      editMember = 1;
    } else {
      editMember = 0;
    }
    Items.update("dsspellCtrl", origMember, editMember);
    $scope.updateItems();
  };

  var beenHere = localStorage.getItem("beenHere2") || false;
  if (beenHere == false) {
    for (var i = 0; i < 28; i++) {
      $scope.createNewItemsMember(i);
    }
    localStorage.setItem("beenHere2", true)
  }

  $scope.updateItems();

}])

.controller('dsprayCtrl', ['$scope', '$cordovaSQLite', 'Items', function($scope, $cordovaSQLite, Items) {
  $scope.items = [];
  $scope.items = null;

  $scope.createNewItemsMember = function(member) {
    Items.add("dsprayCtrl", member);
    $scope.updateItems();
  };

  $scope.updateItems = function() {
    Items.all("dsprayCtrl").then(function(items) {
      $scope.items = items;
    });
  }

  $scope.createNewItemsMember = function(member) {
    Items.add("dsprayCtrl", member, 0);
    $scope.updateItems();
  };

  $scope.removeMember = function(member) {
    Items.remove("dsprayCtrl", member);
    $scope.updateItems();
  };

  $scope.editMember = function(origMember, editMember) {
    if (editMember) {
      editMember = 1;
    } else {
      editMember = 0;
    }
    Items.update("dsprayCtrl", origMember, editMember);
    $scope.updateItems();
  };

  var beenHere = localStorage.getItem("beenHere3") || false;
  if (beenHere == false) {
    for (var i = 0; i < 23; i++) {
      $scope.createNewItemsMember(i);
    }
    localStorage.setItem("beenHere3", true)
  }

  $scope.updateItems();

}])

.controller('dspyroCtrl', ['$scope', '$cordovaSQLite', 'Items', function($scope, $cordovaSQLite, Items) {
  $scope.items = [];
  $scope.items = null;

  $scope.createNewItemsMember = function(member) {
    Items.add("dspyroCtrl", member);
    $scope.updateItems();
  };

  $scope.updateItems = function() {
    Items.all("dspyroCtrl").then(function(items) {
      $scope.items = items;
    });
  }

  $scope.createNewItemsMember = function(member) {
    Items.add("dspyroCtrl", member, 0);
    $scope.updateItems();
  };

  $scope.removeMember = function(member) {
    Items.remove("dspyroCtrl", member);
    $scope.updateItems();
  };

  $scope.editMember = function(origMember, editMember) {
    if (editMember) {
      editMember = 1;
    } else {
      editMember = 0;
    }
    Items.update("dspyroCtrl", origMember, editMember);
    $scope.updateItems();
  };

  var beenHere = localStorage.getItem("beenHere4") || false;
  if (beenHere == false) {
    for (var i = 0; i < 20; i++) {
      $scope.createNewItemsMember(i);
    }
    localStorage.setItem("beenHere4", true)
  }

  $scope.updateItems();

}])

.controller('dsplayCtrl', ['$scope', '$cordovaSQLite', 'Items', function($scope, $cordovaSQLite, Items) {
  $scope.items = [];
  $scope.items = null;

  $scope.createNewItemsMember = function(member) {
    Items.add("dsplayCtrl", member);
    $scope.updateItems();
  };

  $scope.updateItems = function() {
    Items.all("dsplayCtrl").then(function(items) {
      $scope.items = items;
    });
  }

  $scope.createNewItemsMember = function(member) {
    Items.add("dsplayCtrl", member, 0);
    $scope.updateItems();
  };

  $scope.removeMember = function(member) {
    Items.remove("dsplayCtrl", member);
    $scope.updateItems();
  };

  $scope.editMember = function(origMember, editMember) {
    if (editMember) {
      editMember = 1;
    } else {
      editMember = 0;
    }
    Items.update("dsplayCtrl", origMember, editMember);
    $scope.updateItems();
  };

  var beenHere = localStorage.getItem("beenHere5") || false;
  if (beenHere == false) {
    for (var i = 0; i < 20; i++) {
      $scope.createNewItemsMember(i);
    }
    localStorage.setItem("beenHere5", true)
  }

  $scope.updateItems();

}]);
