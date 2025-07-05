/**
 * @fileoverview Users Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * Users controller
 */
NetCommonsApp.controller('Users.controller',
    ['$scope', 'NetCommonsModal', 'NC3_URL', 'LOGIN_USER',
      function($scope, NetCommonsModal, NC3_URL, LOGIN_USER) {

        /**
         * Show user information method
         *
         * @param {number} users.id
         * @return {void}
         */
        $scope.showUser = function($event, id, param) {
          if (! param) {
            param = '';
          } else {
            param = '?' + param;
          }
          if (id == LOGIN_USER.id) {
            NetCommonsModal.show(
                $scope, 'User.view',
                NC3_URL + '/users/users/view/' + LOGIN_USER.id + param
            );
          } else {
            NetCommonsModal.show(
                $scope, 'User.view',
                NC3_URL + '/users/users/view/' + id
            );
          }
          if (angular.isObject($event)) {
            $event.preventDefault();
            $event.stopPropagation();
          }
        };
      }]);


/**
 * User modal controller
 */
NetCommonsApp.controller('User.view',
    ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

      /**
       * dialog cancel
       *
       * @return {void}
       */
      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }]);
