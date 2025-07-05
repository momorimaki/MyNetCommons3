/**
 * @fileoverview CleanUp Javascript
 * @author mutaguchi@opensource-workshop.jp (Mitsuru Mutaguchi)
 */


/**
 * SystemManager Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $window)} Controller
 */
NetCommonsApp.controller('CleanUp', ['$scope', '$http', 'NC3_URL',
  function($scope, $http, NC3_URL) {

    /**
       * Initialize
       *
       * @return {void}
       */
    $scope.initialize = function() {
      // textareaの最下部にスクロール
      var logResult = $('textarea[name="data[_log_result]"]');
      logResult.scrollTop(
          logResult[0].scrollHeight - logResult.height()
      );
    };

    /**
       * URLからデータ取得
       *
       * @return {void}
       */
    $scope.more = function() {
      var url = '/clean_up/clean_up/get_log';
      var logFileNo = $('select[name="data[_log_file]"]').val();
      url = url + '/logFileNo:' + logFileNo;
      //console.log(url);

      $http.get(NC3_URL + url + '.json', {})
          .then(function(response) {
            var data = response.data;
            //console.log(data);
            // textareaの値セット
            var logResult = $('textarea[name="data[_log_result]"]');
            logResult.val(data['cleanUpLog']);

            // textareaの最下部にスクロール
            logResult.scrollTop(
                logResult[0].scrollHeight - logResult.height()
            );
          },
          function(response) {
          });
    };

  }]);
