/**
 * Created by AllCreator on 2015/11/06.
 */
var AuthorizationKeys = angular.module('AuthorizationKeys', []);

AuthorizationKeys.directive('authorizationKeysPopupLink',
    ['$uibModal', 'NC3_URL', function($uibModal, NC3_URL) {
      return {
        scope: {
          url: '@',
          frameId: '@',
          popupTitle: '@',
          popupLabel: '@',
          popupPlaceholder: '@'
        },
        restrict: 'A',
        link: function(scope, element, attr, controller) {
          var Popup = function(event) {
            scope.modalInstance = $uibModal.open({
              animation: true,
              templateUrl:
               NC3_URL + '/authorization_keys/authorization_keys/popup/?frame_id=' +
               scope.frameId +
               '&url=' +
               encodeURIComponent(scope.url) +
               '&unique=' + Math.random().toString(36).slice(2),
              controller: 'authorizationKeyPopupCtrl',
              resolve: {
                url: function() {
                  return scope.url;
                },
                popupTitle: function() {
                  return scope.popupTitle;
                },
                popupLabel: function() {
                  return scope.popupLabel;
                },
                popupPlaceholder: function() {
                  return scope.popupPlaceholder;
                }
              }
            });
          };
          element.bind('click', Popup);
        }
      };
    }]);

NetCommonsApp.requires.push('AuthorizationKeys');

NetCommonsApp.controller('authorizationKeyPopupCtrl',
    ['$scope', '$uibModalInstance', 'url', 'popupTitle', 'popupLabel', 'popupPlaceholder',
      function($scope, $uibModalInstance, url, popupTitle, popupLabel, popupPlaceholder) {
        $scope.url = url;
        $scope.popupTitle = popupTitle;
        $scope.popupLabel = popupLabel;
        $scope.popupPlaceholder = popupPlaceholder;
        $scope.submit = function() {
          $uibModalInstance.dismiss('submit');
        };
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };
     }]);
