'use strict';

var set_nutrition_select = function() {
  if ($('#product_nutrition_ids').length > 0) {
    $('#product_nutrition_ids').select2({
      placeholder: Spree.dishtranslations.nutrition_placeholder,
      multiple: true,
      initSelection: function (element, callback) {
        var url = Spree.url(Spree.routes.nutritions_api, {
          ids: element.val(),
          token: Spree.api_key
        });
        return $.getJSON(url, null, function (data) {
          return callback(data['nutritions']);
        });
      },
      ajax: {
        url: Spree.routes.nutritions_api,
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
            results: data.nutritions
          };
        }
      },
      formatResult: function (nutrition) {
        return nutrition.name;
      },
      formatSelection: function (nutrition) {
        return nutrition.name;
      }
    });
  }
};

$(document).ready(function () {
  set_nutrition_select();
});
