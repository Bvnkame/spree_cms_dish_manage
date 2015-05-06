var DOWText = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var MAX_DISHES = 10;


$(document).on("mouseleave", ".dish", function() {
  var closeButton = $(this).find(".close-button");
  closeButton.removeClass("enable");
});

$(document).on("mouseenter", ".dish", function() {
  var closeButton = $(this).find(".close-button");
  closeButton.addClass("enable");
});

$(document).on("click", ".close-button", function() {
  console.log("Click");

  var dishUI = $(this).parent();
  var dishContainerUI = $(dishUI).parent();

  var dishid = $(dishUI).attr("data-dishid");
  var date = $(dishContainerUI).attr("data-date");

  //Send api
  DeleteDishFromDateDelivery(dishid, date);
  //Clear dish
  dishUI.remove();

});

$(document).ready(function () {
  'use strict';

  var objToday = $(document).find("#server-date");

  if(objToday.length >0 )
  {
    var week = 0;
    var today = objToday.attr("data-date");

    LoadWeekData(0, today);

    //Add select collection
    $(document).find('.dishpicker').dishPicker();

    //left button
    var leftButton = $(document).find("#left-button");
    leftButton.on("click", function(){
      console.log("Click");
      if(week > -1) 
      {
        week--;
        LoadWeekData(week, today);
      } 
    });

    //right button
    var rightButton = $(document).find("#right-button");
    rightButton.on("click", function(){
      if(week < 1) 
      {
        week++;
        LoadWeekData(week, today);
      }
    });
  }

});

function LoadWeekData(week, today)
{
  var weekByText;

  //UI
  switch(week)
  {
    case 1:
      weekByText = "Upcomming Week";
      $("#right-button").addClass("disabled");
      $("#center-bar").addClass("next");
    break;
    case 0:
      weekByText = "This Week";
      $("#center-bar").removeClass("last");
      $("#center-bar").removeClass("next");
      $("#left-button").removeClass("disabled");
      $("#right-button").removeClass("disabled");
    break;
    case -1:
      weekByText = "Last Week";
      $("#center-bar").addClass("last");
      $("#left-button").addClass("disabled");
    break;
  }


  var time = CalculateTimeByWeek(week, today);

  console.log(time.firstDate + ", " + time.lastDate);


  var centerbar = document.getElementById("center-bar");
  var date_start = centerbar.getAttribute("data-datestart");
  var date_end = centerbar.getAttribute("data-dateend");

  var dishContainer = $(document).find(".dishes-container");

  for (i = 0 ; i < dishContainer.length; i++)
  {
    var date = new Date(time.firstDate);
    date = date.setDate( date.getDate() + i);
    $(dishContainer[i]).attr("data-date", TimeFormat(date));
  }

  $(centerbar).attr("data-datestart", TimeFormat(time.firstDate));
  $(centerbar).attr("data-dateend", TimeFormat(time.lastDate));

  var weekByDate = TimeFormat(time.firstDate) + " ==> " + TimeFormat(time.lastDate);

  var html = " <p class='week-by-text'>" + weekByText + "<p> \
               <p class='week-by-date'>" + weekByDate + "<p> \
             ";

  $(centerbar).html(html);

  //Load data
  LoadDataDateDelivery(TimeFormat(time.firstDate), TimeFormat(time.lastDate));
}

function CalculateTimeByWeek(week, today)
{
  var date = new Date(today);

  date.setDate(date.getDate() + 7 * week - date.getDay() + 1);
  var firstDate = new Date(date);

  date.setDate(date.getDate() + 4);
  var lastDate = new Date(date);

  return {
    firstDate: firstDate,
    lastDate: lastDate,
  };
}

function TimeFormat(time)
{
  var timeFormat = new Date(time);

  var d = timeFormat.getDate();

  if( d < 10 )
  {
    d = "0" + d;
  }

  var m = timeFormat.getMonth() + 1;

  if( m < 10 )
  {
    m = "0" + m;
  }

  var y = timeFormat.getFullYear();

  return y + "-" + m + "-" + d;
}

function AddDateDelivery(dishId, date)
{
  var apiUrl = Spree.routes.date_delivery_api;
  var recordId;

  $.ajax({
    url: apiUrl,
    type: 'post',
    async: false,       //NOTE
    data: 
    {
      token: Spree.api_key,
      date_delivery: {
        product_ids: dishId,
        delivery_date: date
      }
    },
    success: function(result)
    {
      recordId = result.id;
    },
    error: function()
    {

    }
  });

  return recordId;
}

function UpdateDateDelivery(recordId, date)
{
  var apiUrl = Spree.routes.date_delivery_api;

  $.ajax({
    url: apiUrl,
    type: 'put',
    //async: false,       //NOTE
    data: 
    {
      token: Spree.api_key,
      date_delivery: {
        id: recordId,
        delivery_date: date
      }
    },
    success: function(result)
    {
      console.log("Update successfully!");
    },
    error: function()
    {

    }
  });
}

function LoadDataDateDelivery(date_start, date_end)
{
  var dishContainer;
  var html;
  var dish;

  var data = GetDataByRangeOfDate(date_start, date_end);
  console.log(data);

  dishContainer = $(document).find(".dishes-container");
  dishContainer.empty()
  for (i = 0; i < data.length; i++)
  {
    dishes = data[i].products;
    var date = data[i]["delivery_date"];

    dishContainer = $(document).find(".dishes-container[data-date='" + date + "']")
    dishContainer.empty();
    //console.log(dishContainer);

    for (k = 0; k < dishes.length; k++)
    {
      //console.log(k);
      var dish = dishes[k];

      var imgUrl = "";

      if(dish.images.length > 0)
      {

        imgUrl = dish.images[0].product_url;
      }

      html = DishItemFormat(dish.pd_id, dish.dish_type_id, dish.id, imgUrl, dish.name);
      //console.log(html);
      $(dishContainer).append(html);
    }
  }
  UpdateIndexAndQuantity();
}

/*--------------------*/
/*  GET DATA          */
/*--------------------*/
function GetDataByRangeOfDate(dateStart, dateEnd)
{
  var apiUrl = Spree.routes.date_delivery_duration_api;
  var dataResult;
  $.ajax(
  {
    url: apiUrl,
    async: false,
    data: 
    {
      start_date: dateStart,
      end_date: dateEnd
    },
    success: function(result)
    {
      //console.log(result);
      dataResult = result;
    },
    error: function()
    {

    }
  });

  return dataResult;
}

function DishItemFormat(id, typeid, dishid, imgUrl, name)
{

  var dishType = getDishType(typeid);

  var html = "\
    <div class='dish draggable drag-drop docked " + dishType + "' data-id='" + id + "' data-dishid='" + dishid + "'>\
      <div class='index'>\
        <p></p>\
      </div>\
      <div class='close-button'>\
        <i class='fa fa-times'></i>\
      </div>\
      <div title='" + name + "' class='image-container'>\
        <img class='image-dish' src='" + imgUrl + "'>\
      </div>\
      <p  title='" + name + "' class='name'>" + name + "</p>\
    </div>\
  ";

  return html;
}

/*--------------------*/
/*  UPDATE            */
/*--------------------*/
function UpdateDateDelivery(id, date)
{
  var apiUrl = Spree.routes.date_delivery_api + "/" + id;
  $.ajax({
    url: apiUrl,
    type: 'put',
    data: 
    {
      token: Spree.api_key,
      delivery_date: date
    },
    success: function(result)
    {
      console.log(result);
    },
    error: function()
    {

    }
  });
}


/*--------------------*/
/*  DELETE            */
/*--------------------*/
function DeleteDishFromDateDelivery(dishid, date)
{
  var apiUrl = Spree.routes.product_search + "/" + dishid + "/remove_date";
  $.ajax({
    url: apiUrl,
    type: 'delete',
    data: 
    {
      token: Spree.api_key,
      delivery_date: date
    },
    success: function(result)
    {
      console.log(result);
    },
    error: function(data)
    {
      console.log(data);
    }
  });
}

function UpdateIndexAndQuantity()
{
  var dishContainer = $(document).find(".dishes-container");

  for ( i = 0; i < dishContainer.length; i++)
  {
      var dishes = $(dishContainer[i]).find(".dish");
      var dishPicker = $(dishContainer[i]).next();

      //Check dishpicker
      if(dishes.length >= MAX_DISHES)
      {
        $(dishPicker).hide();
      }
      else
      {
        $(dishPicker).show();
      }

      var objectDOWTitle = $(dishContainer[i]).prev();
      $(objectDOWTitle).text( DOWText[i] + " (" + dishes.length + ")");

      for( k = 0; k < dishes.length; k++)
      {
        var indexDiv = $(dishes[k]).find(".index");
        var indexText = $(indexDiv).find("p");

        indexText.text(k + 1);
      }
  }
}

function CheckExistDish(objDishContainer, id)
{
  var result = true;
  var dishes = $(objDishContainer).find(".dish");
  for( i = 0; i < dishes.length; i++)
  {
    if($(dishes[i]).attr("data-dishid") == id)
    {
      result = false;
    }
  }

  return result;
} 