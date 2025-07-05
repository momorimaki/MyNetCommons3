/**
 * @fileoverview Questionnaire graph Javascript
 * @author info@allcreator.net (Allcreator co.)
 */

NetCommonsApp.requires.push('nvd3');


/**
 * Questionnaire ResultGraph Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('QuizResult',
    ['$scope', '$window', '$sce', '$timeout', '$log', 'quizzesMessages',
      function($scope, $window, $sce, $timeout, $log, quizzesMessages) {
        $scope.initialize = function(scoreDistribution) {
          $scope.opt = {
            chart: {
              'type': 'multiBarChart',
              'height': 250,
              'showControls': false,
              'showValues': true,
              'duration': 500,
              'margin' : {top: 10, right: 0, bottom: 50, left: 100},
              x: function(d) {return d.label;},
              y: function(d) {return parseInt(d.value);},
              'xAxis': {
                'axisLabel': quizzesMessages.resultScoreLabel,
                'showMaxMin': false
              },
              'yAxis': {
                'axisLabel': quizzesMessages.resultPersonsLabel
              }
            }
          };
          $scope.data = [
            {
              'key': quizzesMessages.resultPersonsLabel,
              'color': '#777'
            }
          ];
          $scope.data[0]['values'] = new Array();
          angular.forEach(scoreDistribution, function(obj) {
            $scope.data[0]['values'].push(obj);
          });
        };
      }]);
NetCommonsApp.controller('QuizResultView',
    ['$scope', '$window', '$sce', '$timeout', '$log', 'quizzesMessages',
      function($scope, $window, $sce, $timeout, $log, quizzesMessages) {
        $scope.initialize = function(scoreHistory, perfectScore) {
          $scope.opt = {
            chart: {
              'type': 'lineChart',
              'height': 250,
              'defined': function(d, i) { return d.isGradeFinished; },
              'showControls': false,
              'showLegend': false,
              'showValues': true,
              'duration': 500,
              'margin' : {top: 10, right: 80, bottom: 50, left: 80},
              x: function(d) {return parseInt(d.answerNumber);},
              y: function(d) {return parseInt(d.summaryScore);},
              'xAxis': {
                'axisLabel': quizzesMessages.resultNumberLabel,
                'showMaxMin': false
              },
              'yAxis': {
                'axisLabel': quizzesMessages.resultScoreLabel
              },
              'forceY': [0, perfectScore]
              //'title': {
              //  'enable': true,
              //  'text': 'あなたのこれまでの成績履歴'
              //}
            }
          };
          $scope.data = [
            {
              'key': quizzesMessages.resultScoreLabel,
              'color': '#777'
            }
          ];
          $scope.data[0]['values'] = new Array();
          angular.forEach(scoreHistory, function(obj) {
            $scope.data[0]['values'].push(obj);
          });
        };
      }]);
