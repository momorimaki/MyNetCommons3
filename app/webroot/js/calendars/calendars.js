/**
 * @fileoverview Calendar Javascript
 * @author info@allcreator.net (Allcreator Co.)
 */

NetCommonsApp.constant('moment', moment);


/**
 * angularJS, NonANgularJS共通で使う、プラグイン名前空間
 */
var CalendarJS = {};  //専用空間

CalendarJS = {};  //専用空間


/**
 * CalendarJS.variables
 *
 * @type {Object.<string>}
 */
CalendarJS.variables = {
  REPEAT_FREQ_DAILY: 'DAILY',
  REPEAT_FREQ_WEEKLY: 'WEEKLY',
  REPEAT_FREQ_MONTHLY: 'MONTHLY',
  REPEAT_FREQ_YEARLY: 'YEARLY',

  RRULE_TERM_COUNT: 'COUNT',
  RRULE_TERM_UNTIL: 'UNTIL'
};

/**
 * angularJSをつかったJavaScriptプログラム(後半に、"NonAngularJS"コードあり)
 */


/**
 * YYYY-MM形式の年月を、言語別のフォーマットに変形するフィルター
 */
NetCommonsApp.filter('formatYyyymm', function() {
  return function(value, languageId) {
    if (!angular.isString(value)) {  //valueが文字列でなければ加工しない
      return value;
    }
    languageId = (languageId + '') || '2';    //lang指定なければデフォルト言語
    switch (languageId) {  //言語別 YYYY-MM 整形
      case '2':
        value = value.replace(/^(\d{1,4})-(\d{1,2})$/, '$1年$2月');
        break;
      default:
    }
    return value;
  }
});


/**
 * YYYY-MM-DD形式の年月を、言語別のフォーマットに変形するフィルター
 */
NetCommonsApp.filter('formatYyyymmdd', function() {
  return function(value, languageId) {
    if (!angular.isString(value)) {  //valueが文字列でなければ加工しない
      return value;
    }

    languageId = (languageId + '') || '2';    //lang指定なければデフォルト言語
    switch (languageId) {  //言語別 YYYY-MM-DD 整形
      case '2':
        value = value.replace(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/, '$1年$2月$3日');
        break;
      default:
    }
    return value;
  }
});

NetCommonsApp.controller('CalendarSchedule', ['$scope', function($scope) {
  $scope.initialize = function(data) {
    $scope.isCollapsed = data.isCollapsed;
  };
}]);

NetCommonsApp.controller('CalendarsTimeline', ['$scope', function($scope) {
  //タイムラインdiv
  var coordinateOrigins = $('.calendar-daily-timeline-coordinate-origin');

  //指定時間のindex値を、タイムラインdivの属性から取り出し
  var idx = $(coordinateOrigins[0]).attr('data-daily-start-time-idx') - 0;

  //00:00の行のtop 誤差をなくすため2300に変更
  //var row0 = $('.calendar-daily-timeline-0000');
  //var row0Top = row0[0].getBoundingClientRect().top;

  //01:00の行のtop
  var row1 = $('.calendar-daily-timeline-0100');
  var row1Top = row1[0].getBoundingClientRect().top;

  //23:00の行のtop
  var row23 = $('.calendar-daily-timeline-2300');
  var row23Top = row23[0].getBoundingClientRect().top;

  //1行(=１時間)の高さ
  //var rowHeight = row1Top - row0Top;
  var rowHeight = (row23Top - row1Top) / 22;

  //指定時間が最初になるよう、divの縦スクロールを移動
  coordinateOrigins[0].scrollTop = rowHeight * idx;

  //$scope.origin = coordinateOrigins[0].scrollTop;
  $scope.rowHeight = rowHeight;

  //0:00高さ固定
  var dataArea = $('.calendar-timeline-data-area');
  dataArea[0].style.height = String(rowHeight) + 'px'; //固定にしないと伸びてしまう

  var row1Width = row1[0].getBoundingClientRect().width;
  $scope.rowWidth = row1Width;
  console.log('rowWitdh %d', row1Width);

  //初期化
  $scope.prevMargin = 0;
  $scope.maxLineNum = 0;
  $scope.Column = [];
  $scope.Column[0] = [];

}]);

NetCommonsApp.controller('CalendarsTimelinePlan', ['$scope', function($scope) {
  $scope.calendarPlans = [];

  $scope.initialize = function(data) {
    $scope.calendarPlans = data.calendarPlans;

    //位置情報を設定
    for (var i = 0; i < data.calendarPlans.length;
        i++) {
      $scope.setTimelinePos(i, $scope.calendarPlans[i].
          fromTime, $scope.calendarPlans[i].toTime);
    }
  };

  $scope.setTimelinePos = function(id, fromTime, toTime) {
    var planObj = document.getElementById('plan' + String(id));

    var start = fromTime.split(':');
    var end = toTime.split(':');

    var startHour = parseInt(start[0]);
    var startMin = parseInt(start[1]);

    var endHour = parseInt(end[0]);
    var endMin = parseInt(end[1]);

    if (endHour < startHour) {
      endHour = 24;
    }

    //高さ
    var height = endHour - startHour;
    height = (height + ((endMin - startMin) / 60)) * $scope.rowHeight;

    //開始位置
    var top = (startHour + (startMin / 60)) * $scope.rowHeight;

    //タイムライン重ならない列数を取得
    var lineNum = $scope.getLineNum(top, (height + top));

    //位置決定
    planObj.style.height = String(height) + 'px';
    planObj.style.top = String(top - $scope.prevMargin) + 'px'; //(調整)

    //前回の位置が蓄積されてくる※位置調整のため
    $scope.prevMargin = $scope.prevMargin + height;

    //次回の重なりチェックのため、値保持
    var data = {x: top, y: (height + top)};
    $scope.Column[lineNum].push(data);

    //左からの位置
    planObj.style.left = String((lineNum * ($scope.rowWidth + 15)) + 5) + 'px';
    planObj.style.position = 'relative';
  };

  $scope.getLineNum = function(x, y) {

    //0列目からチェック
    for (var i = 0; i <= $scope.maxLineNum; i++) {
      if ($scope.checkColumn(i, x, y) == false) {
        return i; //重なりの無い列を返却
      }
    }

    $scope.maxLineNum++; //新しい列
    $scope.Column[$scope.maxLineNum] = [];
    return $scope.maxLineNum;
  };

  $scope.checkColumn = function(checkColumn, x, y) {

    //指定列の重なりチェック
    for (var i = 0; i < $scope.Column[checkColumn].length; i++) {
      if ($scope.checkOverlap($scope.Column[checkColumn][i].
          x, $scope.Column[checkColumn][i].y, x, y) == true) {
        return true;
      }
    }
    return false; //重なりなし
  };

  $scope.checkOverlap = function(x1, y1, x2, y2) {

    //線分1と線分2の重なりチェック
    if (x1 >= x2 && x1 >= y2 &&
        y1 >= x2 && y1 >= x2) {
      return false;
    }
    if (x2 >= x1 && x2 >= y1 &&
        y2 >= x1 && y2 >= y1) {
      return false;
    }
    return true; //重なりあり
  };

}]);

//リサイズ 日跨ぎライン対応
NetCommonsApp.directive('resize', ['$window', function($window) {
  return function(scope, element) {
    var w = angular.element($window);
    w.bind('resize', function() {
      scope.$apply();
    });
  };
}]);

NetCommonsApp.controller('CalendarsMonthlyLinePlan', ['$scope', function($scope) {
  $scope.calendarPlans = [];

  $scope.initialize = function(data) {

    $scope.calendarLinePlans = data.calendarLinePlans;

    //行(日)のtop
    var line1 = $('.calendar-monthly-line-1');
    var line1Top = line1[0].getBoundingClientRect().top;
    var line1Left = line1[0].getBoundingClientRect().left;

    //console.log('line1Top! %d Left %d', line1Top, line1Left);

    //行（土）のtop
    var line7 = $('.calendar-monthly-line-7');
    var line7Top = line7[0].getBoundingClientRect().top;
    var line7Left = line7[0].getBoundingClientRect().left;

    //console.log('line7Top! %d Left %d', line7Top, line7Left);

    //1日cellの横幅基準
    aDayWidth = (line7Left - line1Left) / 6;
    $scope.aDayWidth = aDayWidth;
    //console.log('aDayWidth %d', $scope.aDayWidth);

    //初期化
    $scope.week = [];

    //$scope.week.prevTop = 0; //前回のtop位置（divタグの高さ調整用）
    $scope.sameDiv = 0; //test

    for (var i = 0; i < $scope.calendarLinePlans.length; i++) {  //第n週ループ
      $scope.week[i] = [];
      $scope.week[i].maxLineNum = 0;
      $scope.week[i].prevMargin = 0; //蓄積されているマージン
      $scope.week[i].Column = []; //保持するデータ（重なりチェック）
      $scope.week[i].Column[0] = [];
      $scope.week[i].divTopTotal = []; //調整用高さ（合計）

      for (var celCnt = 0; celCnt < 7; celCnt++) {
        $scope.week[i].divTopTotal[celCnt] = 0;
      }

      $scope.week[i].celCnt = [];
      for (var celCnt = 0; celCnt < 7; celCnt++) { // cell数カウント初期化
        $scope.week[i].celCnt[celCnt] = 0;
      }

    }

    //LINE高さと横幅の調整
    //var beforeHeight = 0;// 一つ前の高さ
    var beforeFromCell = -1; //一つ前の開始セル

    for (var i = 0; i < $scope.calendarLinePlans.length; i++) {  //第n週ループ
      beforeFromCell = -1;
      for (var j = 0; j < $scope.calendarLinePlans[i].length; j++) {
        $scope.setLinePos(
            i, $scope.calendarLinePlans[i][j].id,
            $scope.calendarLinePlans[i][j].fromCell,
            $scope.calendarLinePlans[i][j].toCell, beforeFromCell);
        beforeFromCell = $scope.calendarLinePlans[i][j].fromCell;
      }
    }

    //console.log('$scope.calendarLinePlans.length %d', $scope.calendarLinePlans.length);

    //縦位置の調整
    for (var i = 0; i < $scope.calendarLinePlans.length; i++) {  //第n週ループ
      for (var celCnt = 0; celCnt < 7; celCnt++) { // 各セルに高さ設定
        var divObj = document.getElementById('divline' + String(i) + '_' + String(celCnt));
        //console.log('divTopTotal week %d cell %d divTopTotal %d',
        // i, celCnt, $scope.week[i].divTopTotal[celCnt]);
        //console.log('celCnt week %d cell %d celCnt %d', i, celCnt, $scope.week[i].celCnt[celCnt]);

        divObj.style.height =
            String(($scope.week[i].celCnt[celCnt]) * 25 - $scope.week[i].divTopTotal[celCnt]) +
            'px';
      }
    }
  };

  $scope.setLinePos = function(week, id, fromCell, toCell, beforeFromCell) {
    //console.log('LINE.Plan!setLinePos!.id[%d] fromCell [%d] toCell[%d] beforeHeight[%d]
    // beforeFromCell[%d].', id, fromCell, toCell, beforeHeight, beforeFromCell);
    var planObj = document.getElementById('planline' + String(id) + '_' + String(week));

    //幅設定
    planObj.style.width = String((toCell - fromCell + 1) * $scope.aDayWidth) + 'px';

    //重ならない行数を取得
    var lineNum = $scope.getLineNum(week, fromCell, toCell);

    //Top設定
    var top = 0;
    if (fromCell == beforeFromCell) { // 開始divが同じ場合
      //console.log('SameBefore!! id[%d] fromCell[%d] prevTop[%d]',id , fromCell, $scope.prevTop);
      //top = $scope.prevTop + 5; //前回のtopから5pxだけずらす（divタグの高さ分考慮する）
      $scope.sameDiv++; //test
      top = (25 * lineNum) - (20 * $scope.sameDiv); //

      //console.log('divTopTotal!! week[%d] Cell[%d] divTopTotal[%d]',
      //week , fromCell, $scope.week[week].divTopTotal[fromCell]);
      $scope.week[week].divTopTotal[fromCell] =
          $scope.week[week].divTopTotal[fromCell] + 20; //div高さの差分を累積
    } else { //開始divが異なる
      $scope.sameDiv = 0; //test
      top = (25 * lineNum);
      $scope.week[week].divTopTotal[fromCell] =
          $scope.week[week].divTopTotal[fromCell] + 20; //div高さの差分を累積
    }

    //console.log('top %d', top);

    planObj.style.top = (top) + 'px'; // Top設定
    //planObj.style.position = 'relative';
    //$scope.prevTop = top; // 前回の値を保持(開始divのあるセルはずらす幅が異なるため)

    //fromからToまでlineNumを入れておく
    var celCnt = fromCell;
    for (; celCnt <= toCell; celCnt++) {
      if ($scope.week[week].celCnt[celCnt] <= lineNum) {  // lineNumが大きいとき
        $scope.week[week].celCnt[celCnt] = (lineNum + 1);  //0行と1行の識別のため＋１
      }
    }

    //次回の重なりチェックのため、値保持
    var data = {a: fromCell, b: toCell};
    $scope.week[week].Column[lineNum].push(data);
    return; //planObj.getBoundingClientRect().top;
  };

  $scope.getLineNum = function(week, a, b) {
    //console.log('Monthly.Plan!getLineNum!week[%d] a[%d] b[%d]', week, a, b);

    //0行目からチェック
    for (var i = 0; i <= $scope.week[week].maxLineNum; i++) {
      if ($scope.checkColumn(week, i, a, b) == false) {
        return i; //重なりの無い列を返却
      }
    }

    $scope.week[week].maxLineNum++; //新しい列
    $scope.week[week].Column[$scope.week[week].maxLineNum] = [];
    return $scope.week[week].maxLineNum;
  };

  $scope.checkColumn = function(week, checkColumn, a, b) {
    //console.log('Monthly.Plan!checkColumn!..');

    //指定列の重なりチェック
    for (var i = 0; i < $scope.week[week].Column[checkColumn].length; i++) {
      if ($scope.checkOverlap($scope.week[week].Column[checkColumn][i].
          a, $scope.week[week].Column[checkColumn][i].b, a, b) == true) {
        //console.log('OVER!!!!!! checkColumn %d', i);
        return true;
      }
    }
    return false; //重なりなし
  };

  $scope.checkOverlap = function(a1, b1, a2, b2) {
    //console.log('Monthly.Plan!checkOverlap!..a1[%d] b1[%d] a2[%d] b2[%d]');

    //線分1と線分2の重なりチェック
    if (a1 > a2 && a1 > b2 &&
        b1 > a2 && b1 > a2) {
      return false;
    }
    if (a2 > a1 && a2 > b1 &&
        b2 > a1 && b2 > b1) {
      return false;
    }
    return true; //重なりあり
  };

}]);

NetCommonsApp.controller('CalendarDetailEditWysiwyg',
    ['$scope', 'NetCommonsWysiwyg', function($scope, NetCommonsWysiwyg) {
      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.tinymce = NetCommonsWysiwyg.new();
    }]
);
NetCommonsApp.controller('CalendarsDetailEdit',
    ['$scope', '$location', 'NetCommonsModal', '$http', 'NC3_URL', 'moment',
      function($scope, $location, NetCommonsModal, $http, NC3_URL, moment) {
       $scope.repeatArray = [];  //key=Frame.id、value=T/F of checkbox
       //key=Frame.id,value=index number
       //of option elements
       $scope.exposeRoomArray = [];
       //key=Frame.id,value=T/F of checkbox
       $scope.selectRepeatPeriodArray = [];
       $scope.targetYear = '2016';
       $scope.startDate = [];
       $scope.startDatetime = [];
       $scope.useTime = [];
       $scope.monthlyDayOfTheWeek = [];
       $scope.monthlyDate = [];
       $scope.yearlyDayOfTheWeek = [];
       $scope.selectRepeatEndType = [];
       $scope.useNoticeMail = [];

       $scope.detailStartDate;
       $scope.detailStartDatetime;
       $scope.detailEndDate;
       $scope.detailEndDatetime;

       $scope.rruleUntil;

       $scope.initialize = function(data) {
         $scope.data = angular.fromJson(data);
       };
       // 繰り返し予定全てを変更の場合のみ、先頭の予定の編集画面にしなくてはならない
       // location変更で先頭を読みだしていることにする
       $scope.changeEditRrule = function(firstSibEditLink) {
         if ($scope.editRrule === '2') {
           if (firstSibEditLink !== '') {
              $scope.$parent.sending = true;
              angular.element('#CalendarActionPlanEditForm input').prop('disabled', true);
              angular.element('#CalendarActionPlanEditForm select').prop('disabled', true);
              angular.element('#CalendarActionPlanEditForm button').prop('disabled', true);
              window.location = firstSibEditLink;
           }
         }
       };
       $scope.getUseTimeFlag = function() {
          var useTimeFlag;
          angular.forEach($scope.useTime, function(value, key) {
            useTimeFlag = value;
          }, useTimeFlag);
          return useTimeFlag;
       };
        /**
         * 開始日変更時の処理
         */
       $scope.changeDetailStartDate = function(targetId) {
         var momentStart = moment($scope.detailStartDate);
         //
         // 期間指定フラグONのときは日の設定しない
         var useTimeFlag = $scope.getUseTimeFlag();
         if (useTimeFlag == true) {
           return;
         }

         if ($scope.detailStartDate != '') {
           $('#' + targetId).val($scope.detailStartDate);

           //簡易では、開始日と終了日が統一され「終日」
           //(実質開始のみ）１つとなった。
           //そのため、開始日の値を、終了日のDOMの値に代入する
           //
           var endTargetId = targetId.replace(/Start/g, 'End');
           $('#' + endTargetId).val($scope.detailStartDate);

           // ここにくるのは時刻設定OFFのときなんだからやらなくていいのでは
           // 開始日の変更に合わせて開始時間情報の方も更新しておく
           var momentStartDatetime = moment($scope.detailStartDatetime);
           momentStartDatetime.year(momentStart.year());
           momentStartDatetime.month(momentStart.month());
           momentStartDatetime.date(momentStart.date());
           $scope.detailStartDatetime = momentStartDatetime.format('YYYY-MM-DD HH:mm');

           // 合わせて終了日時も自動更新
           $scope.fixEndTime();
         }
       };
        /**
         * 開始日時に合うように終了日時更新
         */
       $scope.fixEndTime = function() {
         var momentStart = moment($scope.detailStartDatetime);
         var momentEnd = moment($scope.detailEndDatetime || null);
         if (! momentEnd.isAfter(momentStart)) {
           $scope.detailEndDatetime = momentStart.add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
         }
       };
        /**
         * 終了日時に合うように開始日時更新
         * delete for issue#945
        $scope.fixStartTime = function() {
          var momentStart = moment($scope.detailStartDatetime || null);
          var momentEnd = moment($scope.detailEndDatetime);
          if (! momentEnd.isAfter(momentStart)) {
            $scope.detailStartDatetime = momentEnd.add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss');
          }
        };
         */
        /**
         * 開始日時変更時処理
         */
       $scope.changeDetailStartDatetime = function(targetId) {
         var momentStart = moment($scope.detailStartDatetime);

         // 期間指定フラグOFFのときは時間の設定しない
         var useTimeFlag = $scope.getUseTimeFlag();
         if (useTimeFlag == false) {
           return;
         }
         //
         if ($scope.detailStartDatetime != '') {
           $('#' + targetId).val($scope.detailStartDatetime);
           //
           $scope.detailStartDate = momentStart.format('YYYY-MM-DD');
           $scope.fixEndTime();
         }
       };
        /**
         * 終了日変更時処理（Ver3.1.2時点でこの関数が呼ばれることはない）
         */
       $scope.changeDetailEndDate = function(targetId) {
         var momentEnd = moment($scope.detailEndDatetime);
         // 期間指定フラグONのときは日の設定しない
         var useTimeFlag = $scope.getUseTimeFlag();
         if (useTimeFlag == true) {
           return;
         }
         //
         if ($scope.detailEndDate != '') {
           $('#' + targetId).val($scope.detailEndDate);
            /* delete for issue#945
               $scope.detailStartEndDatetime = momentEnd.format('YYYY-MM-DD HH:mm');
               $scope.fixStartTime();
             */
          }
       };
        /**
         * 終了日時変更時処理
         */
       $scope.changeDetailEndDatetime = function(targetId) {
         var momentEnd = moment($scope.detailEndDatetime);
         // 期間指定フラグOFFのときは時間の設定しない
         var useTimeFlag = $scope.getUseTimeFlag();
         if (useTimeFlag == false) {
           return;
         }
         //
         if ($scope.detailEndDatetime != '') {
           $('#' + targetId).val($scope.detailEndDatetime);
           $scope.detailStartEndDate = momentEnd.format('YYYY-MM-DD');
           /* delete for issue#945
               $scope.fixStartTime();
           */
         }
       };

       $scope.changeYearMonth = function(prototypeUrl) {
         var elms = $scope.targetYear.split('-');
         var url = prototypeUrl.replace('YYYY', elms[0]);
         url = url.replace('MM', elms[1]);
         window.location = url;
       };
       $scope.changeYearMonthDay = function(prototypeUrl) {
         //console.log('DEBUGGING...' + $scope.targetYear);

         var elms = $scope.targetYear.split('-');
         var url = prototypeUrl.replace('YYYY', elms[0]);
         url = url.replace('MM', elms[1]);
         url = url.replace('DD', elms[2]);
         window.location = url;
       };

       $scope.setInitRepeatPeriod = function(frameId, idx) {
         //これで、画面をリフレッシュ
         $scope.selectRepeatPeriodArray[frameId] = idx;
       };

       $scope.changePeriodType = function(frameId) {
         var elmDaily = $('.calendar-daily-info_' + frameId);
         var elmWeekly = $('.calendar-weekly-info_' + frameId);
         var elmMonthly = $('.calendar-monthly-info_' + frameId);
         var elmYearly = $('.calendar-yearly-info_' + frameId);

         switch ($scope.selectRepeatPeriodArray[frameId]) {
           case CalendarJS.variables.REPEAT_FREQ_DAILY:
             elmDaily.removeClass('hidden').addClass('show');
             elmWeekly.removeClass('show').addClass('hidden');
             elmMonthly.removeClass('show').addClass('hidden');
             elmYearly.removeClass('show').addClass('hidden');
             break;
           case CalendarJS.variables.REPEAT_FREQ_WEEKLY:
             elmDaily.removeClass('show').addClass('hidden');
             elmWeekly.removeClass('hidden').addClass('show');
             elmMonthly.removeClass('show').addClass('hidden');
             elmYearly.removeClass('show').addClass('hidden');
             break;
           case CalendarJS.variables.REPEAT_FREQ_MONTHLY:
             elmDaily.removeClass('show').addClass('hidden');
             elmWeekly.removeClass('show').addClass('hidden');
             elmMonthly.removeClass('hidden').addClass('show');
             elmYearly.removeClass('show').addClass('hidden');
             break;
           case CalendarJS.variables.REPEAT_FREQ_YEARLY:
             elmDaily.removeClass('show').addClass('hidden');
             elmWeekly.removeClass('show').addClass('hidden');
             elmMonthly.removeClass('show').addClass('hidden');
             elmYearly.removeClass('hidden').addClass('show');
             break;
         }
       };

       $scope.initDescription = function(descriptionVal) {
         $scope.calendarActionPlan = {};
         $scope.calendarActionPlan.description = descriptionVal;
       };

       $scope.toggleEnableTime = function(frameId) {
         if ($scope.useTime[frameId]) {
           //時刻なし(YYYY-MM-DD) -> 時刻あり(YYYY-MM-DD HH:mm)
           if ($scope.detailStartDatetime && $scope.detailStartDatetime.indexOf(':') >= 0) {
             //$scopeの方はYYYY-MM-DD HH:mm
             var domVal = $('#CalendarActionPlanDetailStartDatetime').val();
             if (!domVal || domVal.indexOf(':') === (-1)) {
               //DOMの方は YYYY-MM-DD HH:mm「ではない」.未定義かYYYY-MM-DD
               //なので、$scopeの値を、DOMに反映する。
               $('#CalendarActionPlanDetailStartDatetime').val($scope.detailStartDatetime);
             }
           }
           if ($scope.detailEndDatetime && $scope.detailEndDatetime.indexOf(':') >= 0) {
             //$scopeの方はYYYY-MM-DD HH:mm
             var domVal = $('#CalendarActionPlanDetailEndDatetime').val();
             if (!domVal || domVal.indexOf(':') === (-1)) {
               //DOMの方は YYYY-MM-DD HH:mm「ではない」.未定義かYYYY-MM-DD
               //なので、$scopeの値を、DOMに反映する。
               $('#CalendarActionPlanDetailEndDatetime').val($scope.detailEndDatetime);
             }
           }
         } else {
           //時刻あり(YYYY-MM-DD HH:mm) -> 時刻なし(YYYY-MM-DD)
           if ($scope.detailStartDate && $scope.detailStartDate.indexOf(':') === (-1)) {
             //$scopeの方はYYYY-MM-DD
             var domVal = $('#CalendarActionPlanDetailStartDatetime').val();
             if (!domVal || domVal.indexOf(':') > 0) {
               //DOMの方は YYYY-MM-DD「ではない」.未定義かYYYY-MM-DD HH:mm
               //なので、$scopeの値を、DOMに反映する。
               $('#CalendarActionPlanDetailStartDatetime').val($scope.detailStartDate);
             }
           }
           // 終日設定にされているわけだから終わりの日は最初の日と同じでないと
           $('#CalendarActionPlanDetailEndDatetime').val($scope.detailStartDate);
           /*
           if ($scope.detailEndDate && $scope.detailEndDate.indexOf(':') === (-1)) {
             //$scopeの方はYYYY-MM-DD
             var domVal = $('#CalendarActionPlanDetailEndDatetime').val();
             if (!domVal || domVal.indexOf(':') > 0) {
               //DOMの方は YYYY-MM-DD「ではない」.未定義かYYYY-MM-DD HH:mm
               //なので、$scopeの値を、DOMに反映する。
               $('#CalendarActionPlanDetailEndDatetime').val($scope.detailEndDate);
             }
           }*/

           //checkboxのDOMの値も同期させておく。
           /////$('#CalendarActionPlanEnableTime').prop('checked', true);

         }
       };

       $scope.changeMonthlyDayOfTheWeek = function(frameId) {
         if ($scope.monthlyDayOfTheWeek[frameId] !== '') {
           $scope.monthlyDate[frameId] = '';
         }
       };

       $scope.changeMonthlyDate = function(frameId) {
         if ($scope.monthlyDate[frameId] !== '') {
           $scope.monthlyDayOfTheWeek[frameId] = '';
         }
       };

       $scope.changeYearlyDayOfTheWeek = function(frameId) {
         //yearlyの方は、monthlyと違いDateの方がない.つまり
         //DayOfTheWeekとDateをトグルする必要がないので、なにもしない。
       };

       $scope.setInitRepeatEndType = function(frameId, idx) {
         $scope.selectRepeatEndType[frameId] = idx;  //画面をリフレッシュ
       };

       $scope.changeRepeatEndType = function(frameId) {
         var elmCount = $('.calendar-repeat-end-count-info_' + frameId);
         var elmEndDate = $('.calendar-repeat-end-enddate-info_' + frameId);

         switch ($scope.selectRepeatEndType[frameId]) {
           case CalendarJS.variables.RRULE_TERM_COUNT:
             elmCount.removeClass('hidden').addClass('show');
             elmEndDate.removeClass('show').addClass('hidden');
             break;
           case CalendarJS.variables.RRULE_TERM_UNTIL:
             elmCount.removeClass('show').addClass('hidden');
             elmEndDate.removeClass('hidden').addClass('show');
             break;
         }
       };

       $scope.selectCancel = function() {
       };
       $scope.doSelect = function() {
       };

       $scope.showRepeatConfirmEx = function(
       action, $event, eventKey, firstSibEventId, originEventId, isRecurrence) {

         var url = NC3_URL + '/calendars/calendar_plans/delete';
         url = url + '/' + eventKey;
         if (action != '') {
           url = url + '?action=' + action;
         }
         if ($scope.data.frameId) {
           url = url + '&frame_id=' + $scope.data.frameId;
         }
         if (firstSibEventId > 0) {
           url = url + '&first_sib_event_id=' + firstSibEventId;
         }
         if (originEventId > 0) {
           url = url + '&origin_event_id=' + originEventId;
         }
         if (isRecurrence == 1) {
           url = url + '&is_recurrence=1';
         } else {
           url = url + '&is_recurrence=0';
         }

         //NetCommonsModal.show()の実体は
         // $uibModal.open()です。
         //show()の戻り値は、$udiModal.open()の戻り値です。
         //
         var modalInstance = NetCommonsModal.show(
         $scope,
         'Calendars.showRepeatConfirmExModal',
         url
         );

         //callbackの登録をします。
         modalInstance.result.then(
         function(result) {
           //決定ボタンをクリック
           //クリックのデフォルト動作(この場合form のsubmit)を抑止しておく。
           $event.preventDefault();
           return true;

         },
         function() {
           //背景部分クリックや
           //キャンセルボタンクリックをすると
           //失敗扱いで、ここにくる。
           //クリックのデフォルト動作(この場合form のsubmit)を抑止しておく。
           $event.preventDefault();
           return false;

         }
         );

         $event.preventDefault();
         return false;

       };

       $scope.setInitNoticeMailSetting = function(frameId, bVal) {
         $scope.useNoticeMail[frameId] = bVal;  //画面をリフレッシュ
       };

       $scope.toggleNoticeMailSetting = function(frameId) {
         if ($scope.useNoticeMail[frameId]) {
           //メール通知を使用する
           $('.calendar-mail-setting_' + frameId).show();
         } else {
           //メール通知を使用しない
           $('.calendar-mail-setting_' + frameId).hide();
         }
       };

     }]
);


/**
 * showRepeatConfirmEx Modal
 */
NetCommonsApp.controller('Calendars.showRepeatConfirmExModal',
    ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
      /**
       * dialog cancel
       *
       * @return {void}
       */
      $scope.cancel = function() {
        //alert('キャンセルＡ');
        //削除POPUPでメニューのＸマークや、
        //「キャンセル」ボタンがクリックされた時は、
        //ここがcallされる。
        $uibModalInstance.dismiss('cancel');
      };
    }]
);

NetCommonsApp.controller('CalendarsDelete',
    ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
    }]
);

NetCommonsApp.controller('CalendarModalCtrl', [
  '$scope', '$modalInstance', function($scope, $modalInstance) {
    $scope.ok = function() {
      $modalInstance.close();
    };
    $scope.cancel = function() {
      $modalInstance.dismiss();
    };
  }
]);


/**
 * CalendarFrameSettings Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('CalendarFrameSettings', [
  '$scope', function($scope) {
    /**
     * variables
     *
     * @type {Object.<string>}
     */
    var variables = {
      CALENDAR_DISP_TYPE_SMALL_MONTHLY: '1',
      CALENDAR_DISP_TYPE_LARGE_MONTHLY: '2',
      CALENDAR_DISP_TYPE_WEEKLY: '3',
      CALENDAR_DISP_TYPE_DAILY: '4',
      CALENDAR_DISP_TYPE_TSCHEDULE: '5',
      CALENDAR_DISP_TYPE_MSCHEDULE: '6'
    };

    $scope.initialize = function(data) {
      $scope.data = angular.fromJson(data);
      //$scope.data.frameId;
      //$scope.data.calendarFrameSetting
      //$scope.data.calendarFrameSettingSelectRoom
      //$scope.data.displayTypeOptions
      //が格納される。

      $scope.displayTypes = [];

      $scope.setIsShowElement();

      angular.forEach($scope.data.displayTypeOptions, function(val, key, obj) {
        $scope.displayTypes.push({
          label: val,
          value: key
        });
      });
    };

    $scope.displayChange = function() {
      $scope.setIsShowElement();
    };
    /**
    * 各種選択要素を出してよいかどうか
    */
    $scope.setIsShowElement = function() {
      var type = $scope.data.calendarFrameSetting.displayType;
      if (type == variables.CALENDAR_DISP_TYPE_SMALL_MONTHLY ||
          type == variables.CALENDAR_DISP_TYPE_LARGE_MONTHLY) {
        $scope.isShowStartPos = false;
        $scope.isShowDisplayCount = false;
        $scope.isShowTimelineStart = false;
      } else if (type == variables.CALENDAR_DISP_TYPE_WEEKLY) {
        $scope.isShowStartPos = false;
        $scope.isShowDisplayCount = false;
        $scope.isShowTimelineStart = false;
      } else if (type == variables.CALENDAR_DISP_TYPE_DAILY) {
        $scope.isShowStartPos = false;
        $scope.isShowDisplayCount = false;
        $scope.isShowTimelineStart = true;
      } else if (type == variables.CALENDAR_DISP_TYPE_TSCHEDULE ||
          type == variables.CALENDAR_DISP_TYPE_MSCHEDULE) {
        $scope.isShowStartPos = true;
        $scope.isShowDisplayCount = true;
        $scope.isShowTimelineStart = false;
      } else {
        $scope.isShowStartPos = true;
        $scope.isShowDisplayCount = true;
        $scope.isShowTimelineStart = true;
      }
    };
  }]);


/**
 * angularJSに依存しないJavaScriptプログラム(NonAngularJS)
 */
//var CalendarJS = {};  //専用空間

$(function() {
  var expr = '.calendar-col-week, .calendar-easy-edit,';
  expr += ' .calendar-daily-disp, .calendar-detail-edit';
  $(expr).on('click', function(evt) {
    var url = $(evt.target).attr('data-url');
    // イベント発火要素が１階層もぐりこんでいる構造の場合があるので
    if (! url) {
      var p = $(evt.target).parent(expr);
      if (p) {
        url = $(p.get(0)).attr('data-url');
      }
    }
    if (! url) {
      return;
    }
    window.location = url;
  });
  $('.calendar-plan-list').on('click', function(evt) {
    var url = $(evt.target).attr('data-url');
    if (url == undefined) {
      url = $(evt.target).parents('td.calendar-plan-list').attr('data-url');
    }
    window.location = url;
  });
  $('.calendar-easy-edit-area').on('click', function(evt) {
    var url = $(evt.target).attr('data-url');
    if (url == undefined) {
      var expr = 'div.calendar-easy-edit-area';
      url = $(evt.target).parents(expr).attr('data-url');
    }
    window.location = url;
  });
  $('.calendar-plan-show').on('click', function(evt) {
    var url = $(evt.target).attr('data-url');
    if (url == undefined) {
      var expr = 'p.calendar-plan-show';
      url = $(evt.target).parents(expr).attr('data-url');
    }
    window.location = url;
  });
});
