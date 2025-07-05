/**
 * @fileoverview SystemManager Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * SystemManager Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $window)} Controller
 */
NetCommonsApp.controller('SystemManager', ['$scope', '$window', function($scope, $window) {

  /**
   * Radio click
   *
   * @return {void}
   */
  $scope.click = function($event) {
    return Number($event.target.value);
  };

  /**
   * select click
   *
   * @return {void}
   */
  $scope.select = function(domId, $event) {
    $scope[domId] = $event.target.value;
  };

  /**
   * キャンセル
   *
   * @return {void}
   */
  $scope.cancel = function() {
    $scope.sending = true;
    $window.location.reload();
  };

}]);
