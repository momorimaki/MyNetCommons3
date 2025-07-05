/**
 * @fileoverview UserAttributes Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * UserAttributes Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('UserAttributes', ['$scope', function($scope) {

  /**
   * activeLangId
   *
   * @return {void}
   */
  $scope.activeLangId = '';

  /**
   * userAttributeSetting
   *
   * @type {object}
   */
  $scope.userAttributeSetting = [];

  /**
   * userAttributeChoices
   *
   * @type {object}
   */
  $scope.userAttributeChoices = [];

  /**
   * newChoice
   *
   * @type {object}
   */
  $scope.newChoice = {};

  /**
   * initialize
   *
   * @return {void}
   */
  $scope.initialize = function(data) {
    $scope.userAttributeSetting = data.userAttributeSetting;
    $scope.newChoice = data.newChoice;
    angular.forEach(data.userAttributeChoices, function(choice) {
      $scope.userAttributeChoices.push(choice);
    });
  };

  /**
   * add
   *
   * @return {void}
   */
  $scope.add = function() {
    var choice = angular.copy($scope.newChoice);
    $scope.userAttributeChoices.push(choice);
  };

  /**
   * delete
   *
   * @return {void}
   */
  $scope.delete = function(index) {
    $scope.userAttributeChoices.splice(index, 1);
  };

  /**
   * move
   *
   * @return {void}
   */
  $scope.move = function(type, index) {
    var dest = (type === 'up') ? index - 1 : index + 1;
    if (angular.isUndefined($scope.userAttributeChoices[dest])) {
      return false;
    }

    var destChoice = angular.copy($scope.userAttributeChoices[dest]);
    var targetChoice = angular.copy($scope.userAttributeChoices[index]);
    $scope.userAttributeChoices[index] = destChoice;
    $scope.userAttributeChoices[dest] = targetChoice;
  };

  /**
   * click
   *
   * @return {void}
   */
  $scope.onlyAdministratorClick =
      function($event, readableDomId, editableDomId) {

    var readableEl = $('#' + readableDomId);
    var editableEl = $('#' + editableDomId);
    if (!angular.isObject(readableEl[0]) || !angular.isObject(editableEl[0])) {
      return;
    }

    if (readableEl[0].disabled || editableEl[0].disabled) {
      return;
    }

    if (readableEl[0].checked && ! editableEl[0].checked) {
      if ($event.target.name ===
              'data[UserAttributeSetting][only_administrator_readable]') {
        editableEl[0].checked = true;
      } else {
        readableEl[0].checked = false;
      }
    }
  };

}]);
