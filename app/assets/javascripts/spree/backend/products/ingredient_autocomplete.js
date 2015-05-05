'use strict';

var set_ingredient_select = function(){
  if ($('#product_ingredient_ids').length > 0) {
    $('#product_ingredient_ids').select2({
      placeholder: Spree.dishtranslations.ingredient_placeholder,
      multiple: true,
      initSelection: function (element, callback) {
        var url = Spree.url(Spree.routes.ingredients_api, {
          ids: element.val(),
          token: Spree.api_key
        });
        return $.getJSON(url, null, function (data) {
          return callback(data['ingredients']);
        });
      },
      ajax: {
        url: Spree.routes.ingredients_api,
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
            results: data.ingredients
          };
        }
      },
      formatResult: function (ingredient) {
        // console.log(ingredient);
        // var html = ' \
        //   ' + ingredient.images[0].mini_url + ' \
        //   ' + ingredient.name + ' \
        // ';
        return ingredient.name;
      },
      formatSelection: function (ingredient) {
        return ingredient.name;
      }
    });
  }
};

$(document).ready(function () {
  set_ingredient_select();
});