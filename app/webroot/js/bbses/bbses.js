/**
 * @fileoverview Bbses Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * 記事登録 Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('BbsArticlesEdit',
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
        $scope.bbsArticle = data.bbsArticle;
      };
    }]);


/**
 * 記事詳細 Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $location, $window)} Controller
 */
NetCommonsApp.controller('BbsArticlesView',
    ['$scope', '$location', '$window', function($scope, $location, $window) {

      /**
       * カレントの記事LinkId
       */
      $scope.currentArticleLinkId = null;

      /**
       * 初期処理
       *
       * @return {void}
       */
      $scope.initialize = function() {
        var hash = $location.hash();
        var element = null;
        try {
          if (hash) {
            if (hash.substr(0, 1) === '/') {
              element = $('#' + hash.substr(1));
            } else {
              element = $('#' + hash);
            }
            $scope.currentArticleLinkId = element[0].id;
          }
        } catch (err) {
        }
      };

      /**
       * クリック
       *
       * @return {void}
       */
      $scope.click = function(articleLinkId) {
        if (articleLinkId === $scope.currentArticleLinkId) {
          $scope.currentArticleLinkId = null;
        } else {
          $scope.currentArticleLinkId = articleLinkId;
        }
      };
    }]);
