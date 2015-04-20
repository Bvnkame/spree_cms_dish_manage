// target elements with the "draggable" class
interact('.draggable')
  .draggable({ manualStart: true })
  .on('move', function (event) {
    var interaction = event.interaction;

    // if the pointer was moved while being held down
    // and an interaction hasn't started yet
    if (interaction.pointerIsDown && !interaction.interacting()) {
      var original = event.currentTarget,
          // create a clone of the currentTarget element
          clone = event.currentTarget.cloneNode(true);

      var width = original.offsetWidth
          height = original.offsetHeight;

      // clone.style.Width = width;
      // clone.style.Heigh = height;
      // console.log(width + ", " + height);

      clone.classList.add("dragging");

      original.parentNode.insertBefore(clone, original);
      original.parentNode.removeChild(original);
      // insert the clone to the page
      // TODO: position the clone appropriately

      // start a drag interaction targeting the clone
      interaction.start({ name: 'drag' },
                        event.interactable,
                        clone);
    }
  })
  .on('dragmove', function (event) {

    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  })
  .on('dragend', function (event) {
    var draggableElement = event.target;
    draggableElement.classList.add('docked');
    draggableElement.classList.remove('dragging');
    draggableElement.removeAttribute("style");
    draggableElement.removeAttribute('data-x');
    draggableElement.removeAttribute('data-y');
  });

//=============================
//=============================
interact('.dropzone').dropzone({
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:

  ondropactivate: function (event) {

    var draggableElement = event.target;

    spaceElement = document.createElement("div");
    spaceElement.classList.add("dish","drag-drop","space");
    // add active dropzone feedback
    draggableElement.classList.add('drop-active');

    //console.log(draggableElement.parentNode);//.removeChild(draggableElement);

  },
  ondropmove: function (event) {
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    var cloneElement = draggableElement.cloneNode(true);
    var dishesContainnerElement = dropzoneElement.getElementsByClassName("dishes-container");

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');

    //check exist space element
    var listSpaceElement = dishesContainnerElement[0].getElementsByClassName("space");
    var draggableOffset = draggableElement.getBoundingClientRect();
    var containerOffset = dishesContainnerElement[0].getBoundingClientRect();
    //console.log(listSpaceElement);
    //onsole.log(spaceElement);
    if (listSpaceElement.length == 0)
    {
      //console.log("SET");

      //Calculate position
      // var width = draggableElement.offsetWidth;
      // var height = draggableElement.offsetHeight;

      //Get absolute position

      var distance = draggableOffset.top - containerOffset.top;

      //console.log(distance);
      var elementHeight = draggableElement.offsetHeight;

      var index = parseInt(distance / elementHeight);
      
      dishesContainnerElement[0].insertBefore(spaceElement, dishesContainnerElement[0].childNodes[index + 1]);
    }
    else
    {
      
      dishesContainnerElement[0].removeChild(listSpaceElement[0]);

      //Calculate distance
      var distance = draggableOffset.top - containerOffset.top;

      //Get element height
      var elementHeight = draggableElement.offsetHeight;

      //Get index
      var index = parseInt(distance / elementHeight);

      dishesContainnerElement[0].insertBefore(spaceElement, dishesContainnerElement[0].children[index + 1]);
    }
    //dropzoneElement.appendChild(cloneElement);  
  },
  ondragleave: function (event) {
    var draggableElement = event.relatedTarget,
      dropzoneElement = event.target;
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');

    var dishesContainnerElement = dropzoneElement.getElementsByClassName("dishes-container");
    var listSpaceElement = dishesContainnerElement[0].getElementsByClassName("space");

    //Remove space if not drop
    if (listSpaceElement.length != 0)
    {
      dishesContainnerElement[0].removeChild(listSpaceElement[0]);
    }
  },
  ondrop: function (event) {
    console.log("DROP");
    var draggableElement = event.relatedTarget,
        dropzoneElement = event.target;

    // console.log(dropzoneElement);
    var dishesContainnerElement = dropzoneElement.getElementsByClassName("dishes-container");

    //check exist space element
    var listSpaceElement = dishesContainnerElement[0].getElementsByClassName("space");
    if (listSpaceElement.length != 0)
    {
      dishesContainnerElement[0].replaceChild(draggableElement, listSpaceElement[0]);

      //Update date
      var date = dishesContainnerElement[0].getAttribute("data-date");
      var id = draggableElement.getAttribute("data-id");
      
      console.log(date + "," + id);

      UpdateDateDelivery(id, date);

    }
    //Add new dish to dishes container
    //dishesContainnerElement[0].appendChild( draggableElement );
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});