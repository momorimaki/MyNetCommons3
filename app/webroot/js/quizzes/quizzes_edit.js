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
 * Quiz Edit Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $sce)} Controller
 */

NetCommonsApp.controller('QuizzesEdit',
    ['$scope', '$timeout', function($scope, $timeout) {

      /**
       * Initialize
       *
       * @return {void}
       */
      $scope.initialize = function(frameId, isPublished, quiz) {
        $scope.frameId = frameId;
        $scope.isPublished = isPublished;
        $scope.quiz = quiz;
        $scope.quiz.quiz.estimatedTime = parseInt($scope.quiz.quiz.estimatedTime);
        $scope.quiz.quiz.passingGrade = parseInt($scope.quiz.quiz.passingGrade);
        $scope.changePassLine();
        $scope.calcPerfectScore();
      };
      /**
       * 合格点、時間目安値変更
       *
       * @return {void}
       */
      $scope.changePassLine = function() {
        if (! $scope.hasPassLine()) {
          $scope.quiz.quiz.isRepeatUntilPassing = 0;
        }
        $scope.calcPerfectScore();
      };
      /**
       * 合格点、時間目安値
       *
       * @return {bool}
       */
      $scope.hasPassLine = function() {
        var passGrade = $scope.quiz.quiz.passingGrade;
        var passTime = $scope.quiz.quiz.estimatedTime;
        if ((passGrade == 0 || !(passGrade)) && (passTime == 0 || !(passTime))) {
          return false;
        }
        return true;
      };
      /**
       * 満点計算
       *
       * @return {void}
       */
      $scope.calcPerfectScore = function() {
        $scope.quiz.quiz.perfectScore = 0;
        angular.forEach($scope.quiz.quizPage, function(page, pageIndex) {
          angular.forEach(page.quizQuestion, function(question, qIndex) {
            $scope.quiz.quiz.perfectScore += parseInt(question.allotment);
          });
        });
      };
      /**
       * focus DateTimePicker
       *
       * @return {void}
       */
      $scope.setMinMaxDate = function(ev, min, max) {
        // 自分
        var curEl = ev.currentTarget;
        var elId = curEl.id;

        // minの制限は
        var minDate = $('#answer_start_period').val();
        // maxの制限は
        var maxDate = $('#answer_end_period').val();

        if (elId == 'answer_start_period') {
          $('#answer_start_period').data('DateTimePicker').maxDate(maxDate);
        } else {
          $('#answer_end_period').data('DateTimePicker').minDate(minDate);
        }
      };
    }]);
