//
// http://litutech.blogspot.fr/2014/02/an-angular-table-directive-having.html
//
//---------------------------------------------------------------------------
app.directive('droppable', ['$parse',
  function ($parse) {
    return {

      link: function (scope, element, attr) {

        function onDragOver(e) {

          if (e.preventDefault) {
            e.preventDefault();
          }

          if (e.stopPropagation) {
            e.stopPropagation();
          }
          e.originalEvent.dataTransfer.dropEffect = 'move';
          return false;
        }

        function onDrop(e) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          var data = e.originalEvent.dataTransfer.getData("Text");
          data = angular.fromJson(data);
          var dropfn = attr.drop;
          var fn = $parse(attr.drop);
          scope.$apply(function () {
            scope[dropfn](data, e.target);
          });

        }

        element.bind("dragover", onDragOver);
        element.bind("drop", onDrop);
      }
    };
  }
]);
app.directive('draggable', function () {

  return {

    link: function (scope, elem, attr) {

      elem.attr("draggable", true);
      var dragDataVal = '';
      var draggedGhostImgElemId = '';
      attr.$observe('dragdata', function (newVal) {
        dragDataVal = newVal;
      });

      attr.$observe('dragimage', function (newVal) {
        draggedGhostImgElemId = newVal;
      });

      elem.bind("dragstart", function (e) {
        var sendData = angular.toJson(dragDataVal);
        e.originalEvent.dataTransfer.setData("Text", sendData);

        var dragFn = attr.drag;
        if (dragFn !== 'undefined') {
          scope.$apply(function () {
            scope[dragFn](sendData);
          })
        }
      });
    }
  };
});
