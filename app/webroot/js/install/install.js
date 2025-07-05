$(document).ready(function() {
  $('#language').change(function() {
    var url = window.location.href.split('?')[0];
    url += url.indexOf('?') > -1 ? '&' : '?';
    window.location.href = url + 'language=' + $(this).val();
  });

  var model = '';
  $('#' + model + 'datasource').on('change', function() {
    var type = $('option:selected', this).text();
    if (type === 'Mysql') {
      $('#' + model + 'port').val(3306);
      $('#' + model + 'pogin').val('root');
      $('#' + model + 'pchema').parent().parent().slideUp();
      $('#' + model + 'schema').prop('disabled', true);
    } else if (type === 'Postgresql') {
      $('#' + model + 'port').val(5432);
      $('#' + model + 'login').val('postgres');
      $('#' + model + 'schema').prop('disabled', false).
          parent().parent().slideDown();
    }
  });

  $('#InitDbForm').on('submit', function(event) {
    var dialog = $('div.loader').dialog({
      modal: true,
      resizable: false,
      draggable: false,
      title: 'Installing ...',
      minHeight: 100,
      minWidth: 150,
      close: function() {
        if (timer) {
          clearInterval(timer);
        }
      }
    });
    dialog.dialog('open');
    dialog.removeClass('hidden');
    $('.ui-dialog-titlebar-close').remove();

    return true;
  });
});
