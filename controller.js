(function(){
  'use strict';

  angular
    .controller('tuintracallupteamsCtrl', loadFunction);

  loadFunction.$inject = ['$http','$scope', '$rootScope', 'structureService', '$location', '$sce', '$filter', 'storageService'];

  function loadFunction($http, $scope, $rootScope, structureService, $location, $sce, $filter, storageService){
    structureService.registerModule($location, $scope, 'tuintracallupteams');

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
      $location.path($scope.tuintracallupteams.modulescope.childrenUrl.tuintracallupgames).search('teamId', teamId);
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
      $scope.tuintracallupteams.message = $filter('translate')('tuintra-callupteams.error-loading')+e;
      $rootScope.isBusy = false;
    }

  }
}());
