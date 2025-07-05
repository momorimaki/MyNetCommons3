/**
 *  Multidatabases DatabaseContents JS
 *  コンテンツ編集関連フロントエンド処理
 *  webroot/js/edit_multi_database_contents.js
 *
 *  @author ohno.tomoyuki@ricksoft.jp (Tomoyuki OHNO/Ricksoft, Co., Ltd.)
 *  @link http://www.netcommons.org NetCommons Project
 *  @license http://www.netcommons.org/license.txt NetCommons License
 */

NetCommonsApp.controller('MultidatabaseContentEdit',
    ['$scope', 'NetCommonsWysiwyg', function($scope, NetCommonsWysiwyg) {

      $scope.multidatabaseContent = [];
      $scope.multidatabaseMetadata = [];

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.tinymce = NetCommonsWysiwyg.new();

      /**
       * initialize
       *
       * @param {Object} data
       * @type {object}
       */
      $scope.initialize = function(data) {
        if (data.multidatabaseContent) {
          $scope.multidatabaseContent = data.multidatabaseContent;
          $scope.multidatabaseMetadata = data.multidatabaseMetadata;
        }
      };
    }]);
