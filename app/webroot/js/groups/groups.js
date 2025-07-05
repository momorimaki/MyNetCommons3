/**
 * Groups JavaScript
 */
NetCommonsApp.service('SelectGroupUsers',
    [function() {
      var service = {
        selectUsers: null
      };
      return service;
    }]
);


/**
 * Groups JavaScript
 */
NetCommonsApp.factory('AddGroup',
    ['NetCommonsModal', 'NC3_URL', function(NetCommonsModal, NC3_URL) {
      return function($scope, userId) {
        var getUrl = NC3_URL + '/groups/groups/add/' + userId +
            '/' + Math.random() + '?isModal=1';
        return NetCommonsModal.show(
            $scope, 'Group.add',
            getUrl,
            {
              backdrop: 'static',
              resolve: {
                options: {
                  userId: userId,
                  getUrl: getUrl
                }
              }
            }
        );
      }
    }]
);


NetCommonsApp.controller('GroupsAddGroup',
    ['$scope', '$controller', 'AddGroup',
      function($scope, $controller, AddGroup) {
        $controller('GroupsSelect', {$scope: $scope});

        /**
         * initialize
         *
         * @return {void}
         */
        $scope.initialize = function() {
          // ユーザ選択情報を保持
          $scope.setUsers();
        };

        $scope.showGroupAddDialog = function(userId) {
          AddGroup($scope, userId).result.then(
              function(result) {
                // ポップアップを閉じたあとも、ユーザ選択情報を保持
                $scope.setUsers();
              },
              function() {
                // ポップアップを閉じたあとも、ユーザ選択情報を保持
                $scope.setUsers();
              }
          );
        };

        $scope.setUsers = function() {
          var groupSelectScope =
              angular.element('#group-user-select').scope();
          groupSelectScope.setKeepUsers();
        };
      }]);

NetCommonsApp.controller('Group.add',
    ['$scope', '$controller', '$http', '$q', '$uibModalInstance', 'options', 'NC3_URL',
      function($scope, $controller, $http, $q, $uibModalInstance, options, NC3_URL) {

        $scope.userId = null;
        $scope.data = null;
        $controller('GroupsSelect', {$scope: $scope});

        $scope.cancel = function() {
          $uibModalInstance.close();
        };

        $scope.save = function() {
          var element = angular.element('#GroupAddForm');
          var data = new Object();
          angular.forEach(element.serializeArray(), function(input) {
            data[input['name']] = input['value'];
          }, $scope);

          saveGroup(data, options)
              .success(function(data) {
                $uibModalInstance.close();
              })
              .error(function(data, status) {
                $uibModalInstance.dismiss('error');
              });

        };

        var saveGroup = function(data, options) {
          var deferred = $q.defer();
          var promise = deferred.promise;
          $scope.data = data;
          $http.get(NC3_URL + '/net_commons/net_commons/csrfToken.json')
              .then(function(response) {
                var token = response.data;
                $scope.data['data[_Token][key]'] = token.data._Token.key;

                // POSTリクエスト
                $http.post(
                    options['getUrl'],
                    $.param($scope.data),
                    {
                      cache: false,
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    }
                ).then(
                function(response) {
                      // success condition
                      var data = response.data;
                      deferred.resolve(data);
                    },
                function(response) {
                      var data = response.data;
                      var target = $('#groups-input-name-' + options['userId'] + ' div.has-error');
                      target.empty();
                      angular.forEach(data.error.validationErrors, function(errObj) {
                        angular.forEach(errObj, function(errMsg) {
                          target.append('<div class="help-block">' + errMsg + '</div>');
                        });
                      });
                    });
              },
              function(response) {
                // Token error condition
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


/**
 * Groups JavaScript
 */
NetCommonsApp.factory('SelectGroup',
    ['NetCommonsModal', function(NetCommonsModal) {
      return function($scope, userId, roomId, selectors) {
        return NetCommonsModal.show(
            $scope, 'Group.select',
            $scope.baseUrl + '/groups/groups/select/' +
                userId + '/' + Math.random(),
            {
              backdrop: 'static',
              resolve: {
                options: {
                  userId: userId,
                  roomId: roomId,
                  selectors: selectors
                }
              }
            }
        );
      }
    }]
);


/**
 * Groups JavaScript
 */
NetCommonsApp.directive('groupsSelectedUsers',
    [function() {
      return {
        restrict: 'EA',
        template: '<div id="groups-selected-user-{{user.id}}"' +
            ' class="nc-groups-user-selection-list nc-groups-break-word">' +
            '<img class="user-avatar-xs" ng-src="{{user.avatar}}" />' +
            '<span class="nc-groups-select-user-name">{{user.handlename}}</span>' +
            '<button id="groups-user-del-link{{user.id}}" href="#" ' +
            ' class="btn btn-default btn-xs pull-right" onclick="return false;" ' +
            'ng-click="deleteUser(user.id);">' +
            '<span class="glyphicon glyphicon-remove"></span>' + '</button>' +
            '<input type="hidden" ' +
                'name="data[{{pluginModel}}][{{$index}}][user_id]" ' +
            'value="{{user.id}}" />' +
            '</div>',
        transclude: false,
        scope: false,
        replace: true
      };
    }]);


/**
 * Groups Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, SelectUser)} Controller
 */
NetCommonsApp.controller('GroupsSelect',
    ['$scope', 'filterFilter', 'SelectGroupUsers',
      function($scope, filterFilter, SelectGroupUsers) {

        /**
         * プラグイン側で使用するモデル名
         *
         * @return {array}
         */
        $scope.pluginModel = null;

        /**
         * 会員選択の結果を保持する配列
         *
         * @return {array}
         */
        $scope.users = [];

        /**
         * 会員の選択状態を検知する
         *
         * @return {array}
         */
        $scope.$watch('users', function() {
          return $scope.users;
        }, true);

        /**
         * initialize
         *
         * @return {void}
         */
        $scope.initialize = function(data, pluginModel) {
          $scope.pluginModel = pluginModel;

          angular.forEach(data.users, function(value) {
            $scope.users.push(value);
          });
          angular.forEach(SelectGroupUsers.selectUsers, function(value) {
            $scope.users.push(value);
          });
          $scope.setKeepUsers();
        };

        $scope.addUsers = function(users) {
          $.each(users, function(index, user) {
            var result = filterFilter($scope.users, user);
            if (result.length == 0) {
              $scope.users.push(user);
            }
          });
          $scope.setKeepUsers();
        };

        $scope.deleteUser = function(targetUserId) {
          for (var i = 0; i < $scope.users.length; i++) {
            var user = $scope.users[i];
            if (user.id == targetUserId) {
              $scope.users.splice(i, 1);
              break;
            }
          }
          $scope.setKeepUsers();
        };

        $scope.setKeepUsers = function() {
          SelectGroupUsers.selectUsers = $scope.users;
        };
      }]);


/**
 * Sample Javascript
 *
 * @param {string} Controller name
 * @param {function($scope, SelectUser)} Controller
 */
NetCommonsApp.controller('GroupsSelectUser',
    ['$scope', '$controller', 'SelectUser', function($scope, $controller, SelectUser) {
      $controller('GroupsSelect', {$scope: $scope});

      /**
       * 会員選択ダイアログを表示する
       *
       * @param {number} users.id
       * @return {void}
       */
      $scope.showUserSelectionDialog = function(userId, roomId) {
        SelectUser($scope, userId, roomId, $scope.users).result.then(
            function(result) {
              // 選択したユーザを追加
              $scope.$parent.addUsers(result);
            },
            function() {
            }
        );
      };
    }]);

NetCommonsApp.controller('GroupsSelectGroup',
    ['$scope', 'SelectGroup', function($scope, SelectGroup) {

      $scope.showGroupSelectionDialog = function(userId, roomId) {
        SelectGroup($scope, userId, roomId).result.then(
            function(result) {
            },
            function() {
              // ポップアップを閉じたあとも、ユーザ選択情報を保持
              $scope.$parent.setKeepUsers();
            }
        );
      };
    }]);

NetCommonsApp.controller('Group.select',
    ['$scope', '$controller', '$http', '$q', '$uibModalInstance', 'options', 'NC3_URL',
      function($scope, $controller, $http, $q, $uibModalInstance, options, NC3_URL) {
        $controller('GroupsSelect', {$scope: $scope});

        /**
         * ユーザIDを保持する変数
         */
        $scope.userId = options['userId'];

        /**
         * ルームIDを保持する変数
         */
        $scope.roomId = options['roomId'];

        /**
         * グループを保持する配列
         */
        $scope.groupList = [];

        /**
         * グループのユーザを保持する配列
         */
        $scope.groupUsersList = [];

        /**
         * 選択したユーザを保持する配列
         */
        $scope.selectors = options['selectors'];

        /**
         * Post data
         */
        $scope.data = null;

        /**
         * 初期処理
         *
         * @return {void}
         */
        $scope.initialize = function(groupList, groupUsersList, data) {
          $scope.data = data;
          if (angular.isArray(groupList) && groupList.length > 0) {
            $scope.groupList = groupList;
          }
          $scope.groupUsersList = groupUsersList;
        };

        /**
         * 選択処理
         *
         * @return {void}
         */
        $scope.select = function(index) {
          if (!angular.isArray($scope.selectors)) {
            $scope.selectors = [];
          }
          if (!$scope.selected($scope.groupList[index])) {
            $scope.selectors.push($scope.groupList[index]);
          }
        };

        /**
         * 選択しているかどうかチェックする
         *
         * @return {bool}
         */
        $scope.selected = function(obj) {
          if (!angular.isArray($scope.selectors)) {
            return false;
          }
          var result = false;
          for (var i = 0; i < $scope.selectors.length; i++) {
            if ($scope.selectors[i]['Group']['id'] === obj['Group']['id']) {
              result = true;
              break;
            }
          }
          return result;
        };

        /**
         * 選択の解除処理
         *
         * @return {void}
         */
        $scope.remove = function(index) {
          $scope.selectors.splice(index, 1);
        };

        /**
         * キャンセル処理＆ダイアログ閉じる
         *
         * @return {void}
         */
        $scope.cancel = function() {
          $uibModalInstance.dismiss('cancel');
        };

        /**
         * 決定処理＆ダイアログ閉じる
         *
         * @return {void}
         */
        $scope.save = function() {
          angular.forEach($scope.selectors, function(selector) {
            this.data.GroupSelect.group_id.push(selector.Group.id);
          }, $scope);

          saveGroupSelect()
              .success(function(data) {
                // 選択したユーザを追加
                $scope.$parent.addUsers(data['users']);
                $uibModalInstance.close($scope.selectors);
              })
              .error(function(data, status) {
                $uibModalInstance.dismiss('error');
              });
        };

        /**
         * ユーザ選択したグループ情報更新処理関数
         *
         * @return {Function}
         */
        var saveGroupSelect = function() {
          var deferred = $q.defer();
          var promise = deferred.promise;

          // GETリクエスト
          var config = {
            params: {
              group_id: $scope.data.GroupSelect.group_id.join(','),
              room_id: $scope.roomId
            }
          };
          $http.get(
              NC3_URL + '/groups/groups/users/' + $scope.userId,
              config
          ).then(function(response) {
            // success condition
            var data = response.data;
            deferred.resolve(data);
          }, function(response) {
            // error condition
            var data = response.data;
            var status = response.status;
            deferred.reject(data, status);
          });

          promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
          };

          promise.success = function(fn) {
            promise.then(fn);
            return promise;
          };

          return promise;
        };
      }]);
