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
 * Quiz Add Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $sce)} Controller
 */

NetCommonsApp.controller('QuizzesAdd',
    ['$scope', function($scope) {
      /**
       * Initialize
       *
       * @return {void}
       */
      $scope.initialize = function(createOption, pastQuizzes) {
        $scope.pastQuizzes = pastQuizzes;
        $scope.createOption = createOption;
        $scope.templateFile = '';
        $scope.pastQuestionnaireSelect = '';
      };
      /**
       * Questionnaire be disable to goto next
       *
       * @return {bool}
       */
      $scope.templateFileSet = function() {
        var el = jQuery('#templateFile');
        $scope.templateFile = el[0].value;
      };
    }]
);
