/**
 * @fileoverview Categories Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * Categories Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('Categories', ['$scope', function($scope) {

  /**
   * categories
   *
   * @type {object}
   */
  $scope.categories = [];

  /**
   * initialize
   *
   * @return {void}
   */
  $scope.initialize = function(data) {
    angular.forEach(data.categories, function(value) {
      $scope.categories.push(value);
    });
  };

  /**
   * add
   *
   * @return {void}
   */
  $scope.add = function() {
    var category = {
      Category: {id: null, name: ''},
      CategoryOrder: {id: null, category_key: null}
    };
    $scope.categories.push(category);
  };

  /**
   * delete
   *
   * @return {void}
   */
  $scope.delete = function(index) {
    $scope.categories.splice(index, 1);
  };

  /**
   * move
   *
   * @return {void}
   */
  $scope.move = function(type, index) {
    var dest = (type === 'up') ? index - 1 : index + 1;
    if (angular.isUndefined($scope.categories[dest])) {
      return false;
    }

    var destCategory = angular.copy($scope.categories[dest]);
    var targetCategory = angular.copy($scope.categories[index]);
    $scope.categories[index] = destCategory;
    $scope.categories[dest] = targetCategory;
  };

}]);
