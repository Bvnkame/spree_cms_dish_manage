$(document).ready(function () {
  'use strict';

  if ($('#product_whatneed_ids').length > 0) {
    $('#product_whatneed_ids').select2({
      placeholder: Spree.dishtranslations.nutrition_placeholder,
      multiple: true,
      initSelection: function (element, callback) {
        var url = Spree.url(Spree.routes.whatneeds_api, {
          ids: element.val(),
          token: Spree.api_key
        });
        return $.getJSON(url, null, function (data) {
          return callback(data['whatneeds']);
        });
      },
      ajax: {
        url: Spree.routes.whatneeds_api,
        quietMillis: 200,
        datatype: 'json',
        data: function (term) {
          return {
            q: term,
            token: Spree.api_key
          };
        },
        results: function (data) {
          return {
            results: data.whatneeds
          };
        }
      },
      formatResult: function (whatneed) {
        return whatneed.name;
      },
      formatSelection: function (whatneed) {
        return whatneed.name;
      }
    });
  }
});
