/**
 * @fileoverview Faqs Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * FaqIndex Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('FaqIndex', ['$scope', function($scope) {

  /**
   * Switching display of answer
   *
   * @return {void}
   */
  $scope.displayAnswer = function(id) {
    var element = $(id);
    if (element.hasClass('hidden')) {
      element.removeClass('hidden');
    } else {
      element.addClass('hidden');
    }
  };

}]);


/**
 * FaqQuestion Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('FaqQuestions',
    ['$scope', 'NetCommonsWysiwyg', function($scope, NetCommonsWysiwyg) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.tinymce = NetCommonsWysiwyg.new();

      /**
       * initialize
       *
       * @return {void}
       */
      $scope.initialize = function(data) {
        $scope.faqQuestion = data.faqQuestion;
      };
    }]);


/**
 * FaqQuestionOrders Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('FaqQuestionOrders', ['$scope', function($scope) {

  /**
   * FaqQuestions
   *
   * @type {object}
   */
  $scope.faqQuestions = [];

  /**
   * initialize
   *
   * @return {void}
   */
  $scope.initialize = function(data) {
    $scope.faqQuestions = data.faqQuestions;
    $scope.faqQuestionsMap = data.faqQuestionsMap;
  };

  /**
   * move
   *
   * @return {void}
   */
  $scope.move = function(type, index) {
    var dest = (type === 'up') ? index - 1 : index + 1;
    if (angular.isUndefined($scope.faqQuestions[dest])) {
      return false;
    }

    var destQuestion = angular.copy($scope.faqQuestions[dest]);
    var targetQuestion = angular.copy($scope.faqQuestions[index]);
    $scope.faqQuestions[index] = destQuestion;
    $scope.faqQuestions[dest] = targetQuestion;
  };

  /**
   * Get index
   *
   * @return {void}
   */
  $scope.getIndex = function(key) {
    return $scope.faqQuestionsMap[key];
  };

}]);
