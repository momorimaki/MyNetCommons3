/**
 * Choices Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('CircularNoticeChoices',
    ['$scope', function($scope) {

      /**
       * categories
       *
       * @type {object}
       */
      $scope.choices = [];

      /**
       * initialize
       *
       * @return {void}
       */
      $scope.initialize = function(data) {
        angular.forEach(data.choices, function(value) {
          $scope.choices.push(value);
        });
      };

      /**
       * add
       *
       * @return {void}
       */
      $scope.add = function() {
        var category = {
          CircularNoticeChoice: {id: null, value: ''}
        };
        $scope.choices.push(category);
      };

      /**
       * delete
       *
       * @return {void}
       */
      $scope.delete = function(index) {
        $scope.choices.splice(index, 1);
      };

      /**
       * move
       *
       * @return {void}
       */
      $scope.move = function(type, index) {
        var dest = (type === 'up') ? index - 1 : index + 1;
        if (angular.isUndefined($scope.choices[dest])) {
          return false;
        }
        var destChoice = angular.copy($scope.choices[dest]);
        var targetChoice = angular.copy($scope.choices[index]);
        $scope.choices[index] = destChoice;
        $scope.choices[dest] = targetChoice;
      };

    }]);
