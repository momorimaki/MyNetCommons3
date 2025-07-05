/**
 * @fileoverview Quiz Javascript
 * @author info@allcreator.net (Allcreator Co.)
 */
/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
/**
 * Quiz Frame setting Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $sce)} Controller
 */

NetCommonsApp.controller('QuizzesFrame',
    ['$scope', '$filter', '$sce', '$log', '$attrs', '$timeout',
      function($scope, $filter, $sce, $log, $attrs, $timeout) {
        /**
         * Initialize
         *
         * @return {void}
         */
        $scope.initialize = function(quizzes, quizFrameSettings) {
          $scope.quizzes = quizzes;
          $scope.quizFrameSettings = quizFrameSettings;
          $scope.WinBuf = {allCheck: false};
          $scope.isDisplay = new Array();
          for (var i = 0; i < $scope.quizzes.length; i++) {
            if ($scope.quizzes[i].quizFrameDisplayQuiz.id) {
              $scope.isDisplay[i] = true;
            } else {
              $scope.isDisplay[i] = false;
            }
          }
        };
        /**
         * Quiz Frame Setting AllCheckbox clicked
         *
         * @return {void}
         */
        $scope.allCheckClicked = function() {
          for (var i = 0; i < $scope.quizzes.length; i++) {
            if ($scope.WinBuf.allCheck == true) {
              $scope.isDisplay[i] = true;
            } else {
              $scope.isDisplay[i] = false;
            }
          }
        };
        /**
         * Quiz Frame Setting quiz list sort
         *
         * @return {void}
         */
        $scope.sort = function(fieldName, direction) {
          $scope.quizzes = $filter('orderBy')($scope.quizzes, fieldName, direction);
        };
      }]
);
