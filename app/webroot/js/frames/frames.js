/**
 * Frames JavaScript
 *
 * @author kteraguchi@commonsnet.org (Kohei Teraguchi)
 * @link http://www.netcommons.org NetCommons Project
 * @license http://www.netcommons.org/license.txt NetCommons License
 */


/**
 * FrameSettings Controller Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('FrameSettingsController', ['$scope', function($scope) {

  /**
   * frame
   *
   * @type {object}
   */
  $scope.frame = {};

  /**
   * initialize
   *
   * @return {void}
   */
  $scope.initialize = function(data) {
    $scope.frame = data.frame;
  };

  /**
   * Select of header type
   *
   * @return {void}
   */
  $scope.selectHeaderType = function(headerType) {
    $scope.frame.headerType = headerType;
    $('#FrameHeaderType')[0].value = headerType;
  };
}]);
