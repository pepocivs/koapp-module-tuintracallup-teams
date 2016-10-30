(function(){
  'use strict';

  angular
    .controller('tuintracallupCtrl', loadFunction);

  loadFunction.$inject = ['$http','$scope', '$rootScope', 'structureService', '$location', '$sce', '$filter', 'storageService'];

  function loadFunction($http, $scope, $rootScope, structureService, $location, $sce, $filter, storageService){
    structureService.registerModule($location, $scope, 'tuintracallup');

    $scope.view       = 'teams';
    $scope.selectGame = selectGame;

    $rootScope.isBusy = true;
    init();

    function init() {
      storageService.get('tuintraLogin')
        .then(getInfo)
        .catch(showError);
    }

    function getInfo(data) {
      var userData   = data.value.userInfo;
      var teamFilter = '';
      $scope.domain  = userData.domain;
      if (!isAdmin(userData.permisions)) {
        teamFilter = getTeamFilter(userData.teams);
      }

      $http.get('http://api.tuintra.com/public/'+$scope.domain+'/getTeams'+teamFilter)
        .success(function(data){
          $scope.teams      = data;
          $rootScope.isBusy = false;
        })
        .error(showError);

    }

    function selectGame(teamId) {
      $rootScope.isBusy = true;
      getGames(teamId);
      $scope.view  = 'calendar';
    }


    function getGames(teamId) {
      $http.get('http://api.tuintra.com/public/'+$scope.domain+'/getCalendar?nDays=3&teamId='+teamId)
        .success(function(data){
          $scope.games      = data;
          $rootScope.isBusy = false;
        })
        .error(showError);
    }

    function getTeamFilter(teams) {
      var stringTeams = '?teamId=';
      teams.forEach(function(team) {
        stringTeams += team._id+',';
      });
      return stringTeams;
    }

    function isAdmin(permisions) {
      var admin = false;
      permisions.forEach(function(permision) {
        if (permision.identifier === 'callups' && permision.rol === 'admin') admin = true;
      });
      return admin;
    }

    function showError(e){
      $scope.tuintracallup.message = $filter('translate')('tuintra-callup.error-loading')+e;
      $rootScope.isBusy = false;
    }
  }
}());
