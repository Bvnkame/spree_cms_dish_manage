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

      var dishType = "";

      switch(dish.dish_type_id)
      {
        case 0:
          dishType = "main-dish";
        break;
        case 1:
          dishType = "soup";
        break;
        case 2:
          dishType = "vegetable";
        break;
      }

      this.description ='\
        <div class="dish-select-item">\
          <img title="' + dish.name + '" class="img ' + dishType + '" src="' + imgUrl + '">\
          <div title="' + dish.name + '" class="name">' + dish.name + '</div>\
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
    //Check duplicate dish
    var dish = e.object;
    var objectDishContainer = $(this)[0].previousSibling.previousSibling.previousSibling;

    if(CheckExistDish(objectDishContainer, dish.id))
    {
      addNewDish(objectDishContainer, dish);
      //console.log("selecting val=" + e.val + " choice=" + e.object.text);
    }
    else
    {
      show_flash("notice", "Dish is dupplicated!");
    }
  });
};

function addNewDish(objectDishContainer, dish)
{
  //console.log(, dish);
  

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

  var dishType = getDishType(dish.dish_type_id);

  var html = "\
    <div class='dish draggable drag-drop docked " + dishType + "' data-id='" + id + "'>\
      <div class='index'>\
        <p>1</p>\
      </div>\
      <div class='close-button'>\
        <i class='fa fa-times'></i>\
      </div>\
      <div title='" + dish.name + "' class='image-container'>\
        <img class='image-dish' src='" + imgUrl + "'>\
      </div>\
      <p title='" + dish.name + "' class='name'>" + dish.name + "</p>\
    </div>\
  ";

  $(objectDishContainer).append(html);

  //Check full dishes
  checkFullDish(objectDishContainer);

  //Update quantity
  UpdateIndexAndQuantity();
}

function getDishType(typeId)
{
  var dishType = "";

  switch(typeId)
  {
    case 0:
      dishType = "main-dish";
    break;
    case 1:
      dishType = "soup";
    break;
    case 2:
      dishType = "vegetable";
    break;
  }

  return dishType;
}

function checkFullDish(objectDishContainer)
{
  var dishes = $(objectDishContainer).find(".dish");
  var dishpicker = $(objectDishContainer).find(".dishpicker");

  //Check if number of dishes is more than maximum dishes
  if (dishes.length >= 2)
  {
    dishpicker.hide();
  }
  else
  {
    dishpicker.show();
  }
}