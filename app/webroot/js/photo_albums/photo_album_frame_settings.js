/**
 * PhotoAlbumFrameSettings Javascript
 *
 * @author kteraguchi@commonsnet.org (Kohei Teraguchi)
 * @link http://www.netcommons.org NetCommons Project
 * @license http://www.netcommons.org/license.txt NetCommons License
 */


/**
 * PhotoAlbumFrameSettings Controller
 *
 * @param {string} Controller name
 */
NetCommonsApp.controller('PhotoAlbumsFrameSettingController', [
  function() {
    this.checkedAll = false;
    this.reverse = false;

    this.setValues = function(values) {
      this.displayType = values.displayType;
      this.checkDisplayTypeSlide = values.checkDisplayTypeSlide;
      this.albums = values.albums;
      this.displayAlbumKeys = values.displayAlbumKeys;
    };

    this.checkAll = function() {
      this.displayAlbumKeys = [];
      if (!this.checkedAll) {
        return;
      }

      angular.forEach(this.albums, function(album) {
        this.displayAlbumKeys.push(album.PhotoAlbum.key);
      }, this);
    };

    this.sortBy = function(propertyName) {
      if (this.propertyName === propertyName) {
        this.reverse = !this.reverse;
      }
      this.propertyName = propertyName;
    };
  }
]);
