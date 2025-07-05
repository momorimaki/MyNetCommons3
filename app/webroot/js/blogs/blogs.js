/**
 * Blogs Javascript
 */
NetCommonsApp.controller('Blogs.Entries',
    ['$scope', function($scope) {
      $scope.selectStatus = 0;
      $scope.selectCategory = 0;
      $scope.selectYearMonth = 0;
      $scope.frameId = 0;

      $scope.init = function(frameId) {
        $scope.frameId = frameId;
      };
    }]
);

NetCommonsApp.controller('Blogs.Entries.Entry',
    ['$scope', function($scope) {
      $scope.isShowBody2 = false;

      $scope.showBody2 = function() {
        $scope.isShowBody2 = true;
      };
      $scope.hideBody2 = function() {
        $scope.isShowBody2 = false;

      };
    }]
);

