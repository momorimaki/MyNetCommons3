/**
 * @fileoverview DataTypes Javascript
 * @author nakajimashouhei@gmail.com (Shohei Nakajima)
 */

$(document).ready(function() {
  var unit = 'input[data-type-key="image"]';

  $(unit).on('change', function(event) {
    if (! angular.isUndefined(event.target.files.length) &&
            event.target.files.length > 0) {

      var imgElement = $('#' + event.target.id + 'Image');
      var fileReader = new FileReader();
      fileReader.onload = function() {
        imgElement.attr('src', fileReader.result);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  });
});
