/**
 * Tasks.Content Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('TaskContentEdit',
    function($scope, NetCommonsWysiwyg) {
      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.tinymce = NetCommonsWysiwyg.new();

      /**
       * TaskContent object
       *
       * @type {object}
       */
      $scope.taskContent = [];

      /**
       * Initialize
       *
       * @param {object} TaskContents data
       * @return {void}
       */
      $scope.initialize = function(data) {
        $scope.taskContent = data.TaskContent;
      };

    });


/**
 * Tasks.Charge Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('TaskCharge',
    function($scope) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.target = false;

      /**
       * Initialize
       *
       * @param {object} TaskContents data
       * @return {void}
       */
      $scope.initialize = function(value) {
        $scope.target = value;
      };

      $scope.switchCharge = function($event) {
        $scope.target = $event.target.value;
      };

    });


/**
 * TaskContent.deadline Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, NetCommonsWysiwyg)} Controller
 */
NetCommonsApp.controller('TaskIsDate',
    ['$scope', function($scope) {

      /**
       * tinymce
       *
       * @type {object}
       */
      $scope.flag = false;

      /**
       * Initialize
       *
       * @param {object} TaskContent data
       * @return {void}
       */
      $scope.initialize = function(value) {
        $scope.flag = value;
      };

      $scope.switchIsDate = function($event) {
        $scope.flag = $event.target.value;
      };


      /**
       * focus DateTimePicker
       *
       * @return {void}
       */
      $scope.setStartToDate = function(ev, start, end) {
        var curEl = ev.currentTarget;
        var elId = curEl.id;

        // minの制限は
        var startDate = $('#task_start_date').val();
        // maxの制限は
        var endDate = $('#task_end_date').val();

        if (elId == 'task_start_date') {
          $('#task_start_date').data('DateTimePicker').maxDate(endDate);
        } else {
          $('#task_end_date').data('DateTimePicker').minDate(startDate);
        }
      };


    }]);
