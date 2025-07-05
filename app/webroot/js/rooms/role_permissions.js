/**
 * @fileoverview RolePermission Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */


/**
 * RolePermission factory
 */
NetCommonsApp.factory('RolePermission', function() {

  /**
   * roles
   *
   * @type {Object.<string>}
   */
  var roles = {};

  /**
   * functions
   *
   * @type {Object.<function>}
   */
  var functions = {
    /**
     * initialize method
     */
    initialize: function(data) {
      roles = data.roles;
    },

    /**
     * initialize method
     */
    clickRole: function($event, model, permission, roleKey) {
      var baseRole = roles[roleKey];

      angular.forEach(roles, function(role) {
        var element = $('input[type="checkbox"]' +
                        '[name="data[' + model + ']' +
                        '[' + permission + ']' +
                        '[' + role['roleKey'] + ']' +
                        '[value]"]');

        if (! $event.currentTarget.checked) {
          if (parseInt(baseRole['level']) > parseInt(role['level'])) {
            if (! angular.isUndefined(element[0]) && ! element[0].disabled) {
              element[0].checked = false;
            }
          }
        } else {
          if (parseInt(baseRole['level']) < parseInt(role['level'])) {
            if (! angular.isUndefined(element[0]) && ! element[0].disabled) {
              element[0].checked = true;
            }
          }
        }
      });
    }
  };

  return functions;
});
