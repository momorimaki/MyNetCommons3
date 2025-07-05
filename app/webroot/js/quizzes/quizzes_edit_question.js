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
 * Quiz QuestionEdit Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, $sce)} Controller
 */

angular.module('numfmt-error-module', [])
    .run(function($rootScope) {
      $rootScope.typeOf = function(value) {
        return typeof value;
      };
    })
    .directive('stringToNumber', function() {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$parsers.push(function(value) {
            return '' + value;
          });
          ngModel.$formatters.push(function(value) {
            return parseFloat(value, 10);
          });
        }
      };
    });
NetCommonsApp.requires.push('numfmt-error-module');


/**
 * html tag strip
 */
angular.module('html-to-plaintext-module', [])
    .filter('htmlToPlaintext', function() {
      return function(text, limit) {
        return String(text).replace(/<[^>]+>/gm, '').slice(0, limit);
      }
    });
NetCommonsApp.requires.push('html-to-plaintext-module');

NetCommonsApp.controller('QuizzesEditQuestion',
    ['$scope', '$http', '$q', 'NetCommonsWysiwyg', 'quizzesMessages', '$timeout', 'NC3_URL',
      function($scope, $http, $q, NetCommonsWysiwyg, quizzesMessages, $timeout, NC3_URL) {

       /**
        * tinymce
        *
        * @type {object}
        */
       $scope.tinymce = NetCommonsWysiwyg.new();

       /**
        * serverValidationClear method
        *
        * @param {number} users.id
        * @return {string}
        */
       $scope.isTrue = '1';

       /**
        * variables
        *
        * @type {Object.<string>}
        */
       var variables = {

         /**
          * Relative path to login form
          *
          * @const
          */
         USES_USE: '1',

         TYPE_SELECTION: '1',
         TYPE_MULTIPLE_SELECTION: '2',
         TYPE_WORD: '3',
         TYPE_TEXT_AREA: '4',
         TYPE_MULTIPLE_WORD: '5',

         ANSWER_DELIMITER: '#||||||#',
         DEFAULT_ITEM_COUNT: 3,
         MAX_QUESTION_COUNT: 50,
         MAX_CHOICE_COUNT: 20
       };

       /**
        * Initialize
        *
        * @return {void}
        */
       $scope.initialize = function(isPublished, postUrl, postData, quiz) {
         $scope.isPublished = isPublished;
         $scope.postUrl = postUrl;
         $scope.postData = postData;
         $scope.quiz = quiz;
         $scope.quiz.quizPage = $scope.toArray(quiz.quizPage);

         // 各ページ処理
         for (var pIdx = 0; pIdx < $scope.quiz.quizPage.length; pIdx++) {
           var page = $scope.quiz.quizPage[pIdx];

           $scope.quiz.quizPage[pIdx].tabActive = false;

           // このページの中にエラーがあるか
           $scope.quiz.quizPage[pIdx].hasError = false;
           if (page.errorMessages) {
             $scope.quiz.quizPage[pIdx].hasError = true;
           }

           if (!page.quizQuestion) {
             continue;
           }

           // 各質問処理
           for (var qIdx = 0; qIdx < page.quizQuestion.length; qIdx++) {
             var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];

             // この質問の中にエラーがあるか
             if (question.errorMessages) {
               $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].hasError = true;
               $scope.quiz.quizPage[pIdx].hasError = true;
             }

             if (question.quizCorrect) {
               for (var cIdx = 0; cIdx < question.quizCorrect.length; cIdx++) {
                 var correct = question.quizCorrect[cIdx];
                 if (correct.errorMessages) {
                   $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].hasError = true;
                   $scope.quiz.quizPage[pIdx].hasError = true;
                 }
                 // 正解を未設定でエラーで戻ってきたときは空っぽになっているので
                 if (! correct.correct) {
                   correct.correct = new Array();
                 }
                 // Wizardの行き来中は択一選択とかだと文字列にしかなってないので
                 if (typeof correct.correct == 'string') {
                   correct.correct = correct.correct.split(variables.ANSWER_DELIMITER);
                 }
               }
             }
             // 選択肢がないのならここでcontinue;
             if (!question.quizChoice) {
               continue;
             }
             // 質問の選択肢の中にエラーがあるかのフラグ設定
             // および正解設定ステータスの設定
             question.quizCorrect[0].multiCorrectStat = new Array();
             for (var cIdx = 0; cIdx < question.quizChoice.length; cIdx++) {
               var choice = question.quizChoice[cIdx];
               if (choice.errorMessages) {
                 $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].hasError = true;
                 $scope.quiz.quizPage[pIdx].hasError = true;
               }
               if (jQuery.inArray(choice.choiceLabel, question.quizCorrect[0].correct) != -1) {
                 question.quizCorrect[0].multiCorrectStat[cIdx] = true;
               }
             }
           }
         }
         $scope.quiz.quizPage[0].tabActive = true;
       };
       /**
        * toArray
        *
        * 配列型のはずの変数がなぜかObject扱いになる場合があるので念のための変換
        * @return {Array}
        */
       $scope.toArray = function(src) {
         var dst = new Array();
         angular.forEach(src, function(obj, key) {
           obj = $scope._toArray(obj);
           dst[key] = obj;
         });
         return dst;
       };
       /**
        * _toArray
        *
        * toArrayの再帰関数
        * @return {Object}
        */
       $scope._toArray = function(src) {
         var dst = new Object();
         angular.forEach(src, function(obj, key) {
           if (key == 'quizQuestion' || key == 'quizChoice' || key == 'quizCorrect') {
             obj = $scope.toArray(obj);
           }
           dst[key] = obj;
         });
         return dst;
       };

       /**
        * ge allotment sum
        *
        * @return {void}
        */
       $scope.getAllotmentSum = function() {
         var sum = 0;
         for (var pIdx = 0; pIdx < $scope.quiz.quizPage.length; pIdx++) {
           var page = $scope.quiz.quizPage[pIdx];
           for (var qIdx = 0; qIdx < page.quizQuestion.length; qIdx++) {
             var question = page.quizQuestion[qIdx];
             if (question.allotment) {
               sum += parseInt(question.allotment);
             }
           }
         }
         return sum;
       };
       /**
        * is correct (for multiple choice)
        *
        * @return {void}
        */
       $scope.isCorrect = function(needle, haystack) {
         var len = haystack.length;
         for (var i = 0; i < len; i++) {
           if (haystack[i] == needle) {
             return true;
           }
         }
         return false;
       };
        /**
         * in choice label?
         *
         * @return {void}
         */
        $scope.inChoice = function(needle, haystack) {
          var len = haystack.length;
          for (var i = 0; i < len; i++) {
            if (haystack[i].choiceLabel == needle) {
              return true;
            }
          }
          return false;
        };

       /**
        * Add Quiz Page
        *
        * @return {void}
        */
       $scope.addPage = function($event) {
         // 既に質問数が上限に達している
         if ($scope.checkMaxQuestion() == false) {
           alert(quizzesMessages.maxQuestionWarningMsg);
           return;
         }
         var page = new Object();
         page['pageTitle'] = ($scope.quiz.quizPage.length + 1).toString(10);
         page['pageSequence'] = $scope.quiz.quizPage.length;
         page['key'] = '';
         page['isPageDescription'] = 0;
         page['pageDescription'] = '';
         page['quizQuestion'] = new Array();
         $scope.quiz.quizPage.push(page);

         $scope.addQuestion($event, $scope.quiz.quizPage.length - 1);

         $scope.quiz.quizPage[$scope.quiz.quizPage.length - 1].tabActive = true;
         if ($event) {
           $event.stopPropagation();
         }
       };

       /**
        * Delete Quiz Page
        *
        * @return {void}
        */
       $scope.deletePage = function(idx, message) {
         if ($scope.quiz.quizPage.length < 2) {
           // 残り１ページは削除させない
           return;
         }
         if (confirm(message)) {
           $scope.quiz.quizPage.splice(idx, 1);
           $scope._resetQuizPageSequence();
           // 削除された場合は１枚目のタブを選択するようにする
           $scope.quiz.quizPage[0].tabActive = true;
         }
       };

       /**
        * Quiz Page Sequence reset
        *
        * @return {void}
        */
       $scope._resetQuizPageSequence = function() {
         for (var i = 0; i < $scope.quiz.quizPage.length; i++) {
           $scope.quiz.quizPage[i].pageSequence = i;
         }
       };

       /**
        * Add Quiz Question
        *
        * @return {void}
        */
       $scope.addQuestion = function($event, pageIndex) {
         // 既に質問数が上限に達している
         if ($scope.checkMaxQuestion() == false) {
           alert(quizzesMessages.maxQuestionWarningMsg);
           return;
         }
         var question = new Object();
         if (!$scope.quiz.quizPage[pageIndex].quizQuestion) {
           $scope.quiz.quizPage[pageIndex].quizQuestion = new Array();
         }
         var newIndex = $scope.quiz.quizPage[pageIndex].quizQuestion.length;
         question['questionValue'] = quizzesMessages.newQuestionLabel + (newIndex + 1);
         question['questionSequence'] = newIndex;
         question['questionType'] = variables.TYPE_SELECTION;
         question['key'] = '';
         question['allotment'] = '10';
         question['commentary'] = '';
         question['isChoiceRandom'] = 0;
         question['isChoiceHorizon'] = 0;
         question['isOrderFixed'] = 0;
         question['quizChoice'] = new Array();
         question['quizCorrect'] = new Array();
         question['isOpen'] = true;
         $scope.quiz.quizPage[pageIndex].quizQuestion.push(question);

         var qIndex = $scope.quiz.quizPage[pageIndex].quizQuestion.length - 1;
         for (var itemCount = 0; itemCount < variables.DEFAULT_ITEM_COUNT; itemCount++) {
           $scope.addChoice($event, pageIndex, qIndex, itemCount);
         }
         $scope.addCorrect($event, pageIndex, qIndex);
         $scope.addCorrectWord($event, pageIndex, qIndex, 0, quizzesMessages.newChoiceLabel + 1);

         if ($event) {
           $event.stopPropagation();
         }
       };

       /**
        * Move Quiz Question
        *
        * @return {void}
        */
       $scope.moveQuestion = function($event, pageIndex, beforeIdxStr, afterIdxStr) {
         var beforeIdx = parseInt(beforeIdxStr);
         var afterIdx = parseInt(afterIdxStr);
         var beforeQ =
             $scope.quiz.quizPage[pageIndex].quizQuestion[beforeIdx];
         if (beforeIdx < afterIdx) {
           for (var i = beforeIdx + 1; i <= afterIdx; i++) {
             var tmpQ = $scope.quiz.quizPage[pageIndex].quizQuestion[i];
             $scope.quiz.quizPage[pageIndex].quizQuestion.splice(i - 1, 1, tmpQ);
           }
           $scope.quiz.quizPage[pageIndex].quizQuestion.splice(afterIdx, 1, beforeQ);
         }
         else {
           for (var i = beforeIdx; i >= afterIdx; i--) {
             var tmpQ = $scope.quiz.quizPage[pageIndex].quizQuestion[i - 1];
             $scope.quiz.quizPage[pageIndex].quizQuestion.splice(i, 1, tmpQ);
           }
           $scope.quiz.quizPage[pageIndex].quizQuestion.splice(afterIdx, 1, beforeQ);
         }
         $scope._resetQuizQuestionSequence(pageIndex);
         $event.preventDefault();
         $event.stopPropagation();
       };

       /**
        * Copy to another page Quiz Question
        *
        * @return {void}
        */
       $scope.copyQuestionToAnotherPage = function($event, pageIndex, qIndex, copyPageIndex) {
         // 既に質問数が上限に達している
         if ($scope.checkMaxQuestion() == false) {
           alert(quizzesMessages.maxQuestionWarningMsg);
           return;
         }
         var tmpQ = angular.copy($scope.quiz.quizPage[pageIndex].quizQuestion[qIndex]);
         tmpQ.key = '';
         tmpQ.id = '';
         if (tmpQ.quizChoice) {
           for (var i = 0; i < tmpQ.quizChoice.length; i++) {
             tmpQ.quizChoice[i].key = '';
             tmpQ.quizChoice[i].id = '';
           }
         }
         if (tmpQ.quizCorrect) {
           for (var i = 0; i < tmpQ.quizCorrect.length; i++) {
             tmpQ.quizCorrect[i].key = '';
             tmpQ.quizCorrect[i].id = '';
           }
         }
         $scope.quiz.quizPage[copyPageIndex].quizQuestion.push(tmpQ);

         $scope._resetQuizQuestionSequence(copyPageIndex);
         //$event.stopPropagation();
       };
       /**
        * アコーディオンヘッダの中のドロップダウンメニューボタンのクリックで
        * アコーディオンが開閉するのを抑止するための
        *
        * @return {String}
        */
       $scope.deter = function($event) {
         $event.preventDefault();
         $event.stopPropagation();
       };

       /**
        * Delete Quiz Question
        *
        * @return {void}
        */
       $scope.deleteQuestion = function($event, pageIndex, idx, message) {
         if ($scope.quiz.quizPage[pageIndex].quizQuestion.length < 2) {
           return;
         }
         if (confirm(message)) {
           $scope.quiz.quizPage[pageIndex].quizQuestion.splice(idx, 1);
           $scope._resetQuizQuestionSequence(pageIndex);
         }
         // ここでやってはいけない！ページの再読み込みが走る
         //$event.stopPropagation();
       };

       /**
        * Quiz Question Sequence reset
        *
        * @return {void}
        */
       $scope._resetQuizQuestionSequence = function(pageIndex) {
         for (var i = 0; i < $scope.quiz.quizPage[pageIndex].quizQuestion.length; i++) {
           $scope.quiz.quizPage[pageIndex].quizQuestion[i].questionSequence = i;
         }
       };

       /**
        * Add Quiz Choice
        *
        * @return {void}
        */
       $scope.addChoice = function($event, pIdx, qIdx, choiceCount) {
         var page = $scope.quiz.quizPage[pIdx];
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         var choice = new Object();

         if (!question.quizChoice) {
           $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizChoice = new Array();
         }
         var newIndex = question.quizChoice.length;

         // 選択肢設置数上限
         if (newIndex == variables.MAX_CHOICE_COUNT) {
           alert(quizzesMessages.maxChoiceWarningMsg);
           return;
         }

         choice['choiceSequence'] = newIndex;
         choice['choiceLabel'] = quizzesMessages.newChoiceLabel + (choiceCount + 1);
         choice['key'] = '';

         // 指定された新しい選択肢を追加する
         $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizChoice.push(choice);

         if ($event != null) {
           $event.stopPropagation();
         }
       };
       /**
        * Delete Quiz Choice
        *
        * @return {void}
        */
       $scope.deleteChoice = function($event, pIdx, qIdx, seq) {
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];

         if (question.quizChoice.length < 2) {
           return;
         }
         for (var i = 0; i < question.quizChoice.length; i++) {
           if (question.quizChoice[i].choiceSequence == seq) {
             var choices = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizChoice;
             var choiceLabel = choices[i].choiceLabel;
             // 削除する選択肢のラベルが正解に入っていたら正解データから削除する
             var correctIndex = jQuery.inArray(choiceLabel, question.quizCorrect[0].correct);
             if (correctIndex != -1) {
               question.quizCorrect[0].correct.splice(correctIndex, 1);
             }
             question.quizChoice.splice(i, 1);
           }
         }
         $scope._resetQuizChoiceSequence(pIdx, qIdx);

         if ($event) {
           $event.stopPropagation();
         }
       };
       /**
        * Quiz Choice Sequence reset
        *
        * @return {void}
        */
       $scope._resetQuizChoiceSequence = function(pageIndex, qIndex) {
         var choiceLength =
             $scope.quiz.quizPage[pageIndex].quizQuestion[qIndex].quizChoice.length;
         for (var i = 0; i < choiceLength; i++) {
           $scope.quiz.quizPage[pageIndex].quizQuestion[qIndex].quizChoice[i].choiceSequence = i;
         }
       };

       /**
        * add correct
        *
        * @return {void}
        */
       $scope.addCorrect = function($event, pIdx, qIdx) {
         var page = $scope.quiz.quizPage[pIdx];
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         var correct = new Object();

         if (!question.quizCorrect) {
           $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizCorrect = new Array();
         }
         var newIndex = question.quizCorrect.length;

         // 回答単語欄設置数上限
         if (newIndex == variables.MAX_CHOICE_COUNT) {
           alert(quizzesMessages.maxChoiceWarningMsg);
           return;
         }

         correct['correctSequence'] = newIndex;
         correct['correct'] = new Array();
         correct['newWordCorrect'] = '';

         // 指定された新しい正解を追加する
         $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizCorrect.push(correct);

         if ($event != null) {
           $event.stopPropagation();
         }
       };
       /**
        * delete correct
        *
        * @return {void}
        */
       $scope.deleteCorrect = function($event, pIdx, qIdx, cIdx) {
         var page = $scope.quiz.quizPage[pIdx];
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];

         question.quizCorrect.splice(cIdx, 1);
       };
       /**
       * correct set (for multi select
       *
       * @return {void}
       */
       $scope.resetMultipleCorrect = function(pIdx, qIdx) {
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         if (question.questionType != variables.TYPE_MULTIPLE_SELECTION) {
           return;
         }
         var corrects = question.quizCorrect[0];
         corrects.correct.splice(0, corrects.correct.length);
         angular.forEach(corrects.multiCorrectStat, function(value, key) {
           if (value === true) {
             var lbl = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizChoice[key].choiceLabel;
              corrects.correct.push(lbl);
           }
         });
       };
       /**
        * add correct word
        *
        * @return {void}
        */
       $scope.addCorrectWord = function($event, pIdx, qIdx, correctIndex, correctLabel) {
         if (!correctLabel || correctLabel.length == 0) {
           alert(quizzesMessages.warningCorrectWordAdd);
           return;
         }
         var page = $scope.quiz.quizPage[pIdx];
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         var correct = question.quizCorrect[correctIndex];
         correct.correct.push(correctLabel);
         correct.newWordCorrect = '';
       };
       /**
        * remove correct word
        *
        * @return {void}
        */
       $scope.removeCorrectWord = function($event, pIdx, qIdx, correctIndex, correctLabel) {
         var page = $scope.quiz.quizPage[pIdx];
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         var correct = question.quizCorrect[correctIndex];
         var index = correct.correct.indexOf(correctLabel);

         correct.correct.splice(index, 1);
       };

       /**
        * change Question Type
        *
        * @return {void}
        */
       $scope.changeQuestionType = function($event, pIdx, qIdx) {
         var question = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx];
         var choice = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizChoice;
         var correct = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizCorrect;

         // テキストなどのタイプから選択肢などに変更されたとき
         // 選択肢要素が一つもなくなっている場合があるので最低一つは存在するように
         if (! choice || choice.length == 0) {
           for (var itemCount = 0; itemCount < variables.DEFAULT_ITEM_COUNT; itemCount++) {
             $scope.addChoice($event, pIdx, qIdx, itemCount);
           }
         }
         // 正解がなくなっている場合に備えて最低いっこは存在するように
         if (! correct || correct.length == 0) {
           $scope.addCorrect($event, pIdx, qIdx);
         }
         // 単語複数のときはデフォルト３つの単語回答を作る
         if (question.questionType == variables.TYPE_MULTIPLE_WORD) {
           if (correct.length < variables.DEFAULT_ITEM_COUNT) {
             for (var itemCt = correct.length; itemCt < variables.DEFAULT_ITEM_COUNT; ) {
               $scope.addCorrect($event, pIdx, qIdx);
               itemCt = $scope.quiz.quizPage[pIdx].quizQuestion[qIdx].quizCorrect.length;
             }
           }
         }
         // 選択肢系
         if (question.questionType == variables.TYPE_SELECTION ||
             question.questionType == variables.TYPE_MULTIPLE_SELECTION) {
           var newCorrect = jQuery.grep(question.quizCorrect[0].correct, function(n, i) {
             return ($scope.inChoice(n, question.quizChoice));
           });
           question.quizCorrect[0].correct = newCorrect;
         }
       };
        /**
         * 現在の質問数に＋１したらMAXを超えてしまうかどうかのガード
         *
         * @return {bool}
         */
        $scope.checkMaxQuestion = function() {
          var ct = 0;
          var pageArr = $scope.quiz.quizPage;
          for (var i = 0; i < pageArr.length; i++) {
            ct += pageArr[i].quizQuestion.length;
          }
          if (ct + 1 > variables.MAX_QUESTION_COUNT) {
            return false;
          }
          return true;
        };
        /**
         * １質問ずつの分割送信
         * JSで保持しているquizをそのまま送ると、
         * Angularが付け加えているハッシュ属性まで送ってしまうので明示的に送信データにコピーしている
         * 属性名はCakeで処理しやすいようにスネーク記法にしておく
         *
         * @return {void}
         */
        $scope.post = function(action) {
          var promises = new Array();
          var pageIndex = 0;

          $scope.$parent.sending = true;

          angular.forEach($scope.quiz.quizPage, function(page) {
            var qIndex = 0;
            angular.forEach(page.quizQuestion, function(question) {
              var postPage = new Object();
              postPage.QuizPage = new Object();
              postPage.QuizPage[pageIndex] = new Object();
              postPage.QuizPage[pageIndex].key = page.key;
              postPage.QuizPage[pageIndex].is_page_description = page.isPageDescription;
              postPage.QuizPage[pageIndex].page_description = page.pageDescription;
              postPage.QuizPage[pageIndex].page_sequence = pageIndex;

              postPage.QuizPage[pageIndex].QuizQuestion = new Object();
              postPage.QuizPage[pageIndex].QuizQuestion[qIndex] = new Object();
              var postQ = postPage.QuizPage[pageIndex].QuizQuestion[qIndex];

              postQ.key = question.key;
              postQ.question_sequence = qIndex;
              postQ.question_value = question.questionValue;
              postQ.question_type = question.questionType;

              postQ.is_choice_random = question.isChoiceRandom;
              postQ.is_choice_horizon = question.isChoiceHorizon;
              postQ.is_order_fixed = question.isOrderFixed;

              postQ.allotment = question.allotment;
              postQ.commentary = question.commentary;

              if (question.quizChoice) {
                postQ.QuizChoice = new Object();
                var cIndex = 0;
                angular.forEach(question.quizChoice, function(choice) {
                  postQ.QuizChoice[cIndex] = new Object();
                  postQ.QuizChoice[cIndex].key = choice.key;
                  postQ.QuizChoice[cIndex].choice_sequence = cIndex;
                  postQ.QuizChoice[cIndex].choice_label = choice.choiceLabel;
                  cIndex++;
                });
              }
              if (question.quizCorrect) {
                postQ.QuizCorrect = new Object();
                var coIndex = 0;
                angular.forEach(question.quizCorrect, function(correct) {
                  // 複数単語のとき以外は正解は１番目のものだけが対象なので
                  // それだけを送るようにします
                  var pileUp = false;
                  if (question.questionType != variables.TYPE_MULTIPLE_WORD) {
                    if (coIndex == 0) {
                      pileUp = true;
                    }
                  } else {
                    pileUp = true;
                  }
                  if (pileUp == true) {
                    postQ.QuizCorrect[coIndex] = new Object();
                    postQ.QuizCorrect[coIndex].key = correct.key;
                    postQ.QuizCorrect[coIndex].correct_sequence = coIndex;
                    postQ.QuizCorrect[coIndex].correct_label = correct.correctLabel;
                    postQ.QuizCorrect[coIndex].correct = correct.correct;
                    coIndex++;
                  }
                });
              }

              promises.push($scope.postQuizElm(postPage));

              qIndex++;

            }, $scope);

            pageIndex++;

          }, $scope);

          $q.all(promises).then(
             function() {
               var fm = angular.element('#finallySubmitForm');
               fm[0].submit();
               // 送信に全て成功したときは画面がリダイレクトされるから何もしない
             },
             function() {
               // 送信が１回でも失敗したら送信中状態（sending）をfalseにしてエラー表示する
               $scope.$parent.sending = false;
               $scope.$parent.flashMessage(quizzesMessages.sendingErrorMsg, 'danger', 5000);
             }
          );
        };
        /**
         * 送信処理実体
         *
         * @return {void}
         */
        $scope.postQuizElm = function(ajaxPost) {
          var deferred = $q.defer();
          var promise = deferred.promise;

          $http.get(NC3_URL + '/net_commons/net_commons/csrfToken.json')
             .then(function(response) {
               var token = response.data;
               var postData;
               postData = $scope.postData;
               postData._Token.key = token.data._Token.key;
               if (ajaxPost) {
                 postData.QuizPage = ajaxPost.QuizPage;
               } else {
                 postData.QuizPage = new Object();
               }
               $http.post(NC3_URL + $scope.postUrl, $.param({_method: 'POST', data: postData}),
                   {cache: false,
                     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                   }
               ).then(function(response) {
                 var data = response.data;
                 deferred.resolve(data);
               }, function(response) {
                 var data = response.data;
                 var status = response.status;
                 deferred.reject(data, status);
               });
             },
             function(response) {
               var data = response.data;
               var status = response.status;
               deferred.reject(data, status);
             });

          promise.success = function(fn) {
            promise.then(fn);
            return promise;
          };
          promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
          };
          return promise;
        };
     }]);
