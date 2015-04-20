$.fn.dishPicker = function() {
  return this.select2({
    placeholder: "Choose dish", //Spree.translations.variant_placeholder,
    minimumInputLength: 1,
    allowClear: false,
    initSelection: function(element, callback) {
      return $.get(Spree.routes.product_search + "/" + element.val(), {}, function(data) {
        return callback(data);
      });
    },
    ajax: {
      url: Spree.url(Spree.routes.product_search),
      datatype: "json",
      data: function(term, page) {
        return {
          q: {
            name_cont: term
          },
          token: Spree.api_key
        };
      },
      results: function(data, page) {
        window.products = data["products"];
        return {
          results: data["products"]
        };
      }
    },
    formatResult : function(dish)
    {
      var imgUrl = "";
      if(dish.images.length > 0)
      {
        imgUrl = dish.images[0].product_url;
      }

      this.description ='\
        <div class="dish-select-item">\
          <img class="image" src="' + imgUrl + '">\
          <p class="name">' + dish.name + '</p>\
        </div>\
      ';
      return this.description;
    },
    formatSelection: function(product) {
      if (!!product.options_text) {
        return product.name + (" (" + product.name + ")");
      } else {
        return product.name;
      }
    }
  })
  .on("select2-removed", function(e) {
    console.log("removed val=" + e.val + " choice=" + e.choice.text);
  })
  .on("select2-selecting", function(e) {

    addNewDish($(this), e.object);
    //console.log("selecting val=" + e.val + " choice=" + e.object.text);
  });
};

function addNewDish(parent, dish)
{
  //console.log(, dish);
  var objectDishContainer = parent[0].previousSibling.previousSibling.previousSibling;

  console.log(objectDishContainer);
  var imgUrl = "";
  var dishId = dish.id;
  if(dish.images.length > 0)
  {
    imgUrl = dish.images[0].product_url;
  }

  var date = $(objectDishContainer).attr("data-date");
  var id = AddDateDelivery(dishId, date);
  console.log(id);

  var html = "\
    <div class='dish draggable drag-drop docked' data-id='" + id + "'>\
      <div class='close-button'>\
        <i class='fa fa-times'></i>\
      </div>\
      <div class='image-container'>\
        <img class='image-dish' src='" + imgUrl + "'>\
      </div>\
      <p class='name'>" + dish.name + "</p>\
    </div>\
  ";

  $(objectDishContainer).append(html);
}