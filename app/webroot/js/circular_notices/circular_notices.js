/**
 * @fileoverview CircularNotices Javascript
 * @author Kuwata.Hirohisa@withone.co.jp (Hirohisa Kuwata)
 */


/**
 * CircularNotices.edit Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('CircularNoticeEdit',
    ['$scope', 'NetCommonsWysiwyg', function($scope, NetCommonsWysiwyg) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.tinymce = NetCommonsWysiwyg.new();

      /**
       * CircularNoticeContent object
       *
       * @type {object}
       */
      $scope.circularNoticeContent = [];

      /**
       * Initialize
       *
       * @param {object} CircularNoticeContents data
       * @return {void}
       */
      $scope.initialize = function(data) {
        $scope.circularNoticeContent = data;
      };

    }]);


/**
 * CircularNotices.target Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('CircularNoticeTarget',
    ['$scope', function($scope) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.target = false;

      /**
       * Initialize
       *
       * @param {object} CircularNoticeContents data
       * @return {void}
       */
      $scope.initialize = function(value) {
        $scope.target = value;
      };

      $scope.switchTarget = function($event) {
        $scope.target = $event.target.value;
      };
    }]);


/**
 * CircularNotices.deadline Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('CircularNoticeDeadline',
    ['$scope', function($scope) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.deadline = false;

      /**
       * Initialize
       *
       * @param {object} CircularNoticeContents data
       * @return {void}
       */
      $scope.initialize = function(value) {
        $scope.deadline = value;
      };

      $scope.switchDeadline = function($event) {
        $scope.deadline = $event.target.value;
      };
    }]);


/**
 * CircularNotices.view Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('CircularNoticeView',
    ['$scope', function($scope) {

      /**
       * Initialize
       *
       * @return {void}
       */
      $scope.initialize = function() {
        $scope.showReplyForm = false;
        $scope.showOtherUsers = true;
      };

      /**
       * Switch reply form
       *
       * @param {boolean} Flag of visibility
       * @return {void}
       */
      $scope.switchReplyForm = function(isVisible) {
        $scope.showReplyForm = isVisible;
      };

      /**
       * Switch other user's list
       *
       * @param {boolean} Flag of visibility
       * @return {void}
       */
      $scope.switchOtherUserView = function(isVisible) {
        $scope.showOtherUsers = isVisible;
      };

    }]);
