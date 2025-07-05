/**
 * @fileoverview BlockRolePermissions Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * RoomRolePermissions Javascript
 *
 * @param {string} Controller name
 * @param {function($scope)} Controller
 */
NetCommonsApp.controller('RoomRolePermissions',
    ['$scope', 'RolePermission', function($scope, RolePermission) {

      /**
       * RolePermission
       */
      $scope.RolePermission = RolePermission;

    }]);
