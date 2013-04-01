// 1. When starting - set the position already to absolute (because otherwise it might flow when another element is removed)
// 2. The handle can be a selector or an element of a jQuery element
// 3. When moving the handle, move the container too





(function ($) {

console.log("hello");

    $.fn.extend({

        //pass the options variable to the function
        jdrag: function (options) {


            //Set the default values, use comma to separate the settings, example:
            var defaults = {
                    handle: this
                },
                opts =  $.extend(defaults, options),
                currentElement,
                $currentElement,
                doc = $(document),
                initialPosition;
	
            return this.each(function() {
                var $this = $(this),
					o = opts,
                    handle = $(o.handle);

// handle can be an object, a jQuery object, or a query selector


                //setDraggableListeners(this);
                handle.on({
					'mousedown': function (event) {
						startDragging(event, this);
					},
					'mouseup': removeDocumentListeners,
					'mouseenter': function (event) {
						document.body.style.cursor = "pointer";
					},
					'mouseleave': function (event) {
						document.body.style.cursor = "default";
					}
				});

                function setElementStartStyles(element) {
                    element.style.position = 'absolute';
                }

/*                function setDraggableListeners(element) {
                    element.draggableListeners = {
                        start: [],
                        drag: [],
                        stop: []
                    };
                    element.whenDragStarts = addListener(element, 'start');
                    element.whenDragging = addListener(element, 'drag');
                    element.whenDragStops = addListener(element, 'stop');

                    // we can use this like $(element).on("start", function() {});

                }*/

                function startDragging(event, element) {

                    var initialPosition;

                    cancelDocumentSelection(event);

                    currentElement = element;
                    $currentElement = $(element);
                    currentZ = $currentElement.css('zIndex');
                    
                    // this function is already called when beginning
                    initialPosition = getInitialPosition($currentElement);
                	setElementStartStyles(element);
                    
                    // bz 20130331 - should we update the style at once?
					currentElement.style.left = inPixels(initialPosition.left);
                    currentElement.style.top = inPixels(initialPosition.top);



                    // We remember here the relative position of the mouse to calculate the movement
                    currentElement.lastXPosition = event.clientX;
                    currentElement.lastYPosition = event.clientY;

/*                    var okToGoOn = triggerEvent('start', { x: initialPosition.left, y: initialPosition.top, mouseEvent: event });
                    if (!okToGoOn) {
                    	console.log("not okToGo");
                        return;
                    }*/

                    addDocumentListeners();



                }

                function addListener(element, type) {
                    return function(listener) {
                        element.draggableListeners[type].push(listener);
                    };
                }


				
/*                function triggerEvent(type, args) {

                    var result = true;
                    var listeners = currentElement.draggableListeners[type];
                    for (var i = listeners.length - 1; i >= 0; i--) {
                        if (listeners[i](args) === false) { 
							result = false;
						}
                    };
                    return result;
                }*/

                function addDocumentListeners() {
                    doc.on({
						//'selectstart': cancelDocumentSelection,
						'mousemove': repositionElement,
						'mouseup': removeDocumentListeners
					});
                }

                function getInitialPosition($el) {
                    var top = 0,
						left = 0,
						position = $el.position();

					top = position.top;
                    left =  position.left;

                    //left = left - (parseInt($el.css('margin-left'),10) || 0) - (parseInt($el.css('border-left'),10) || 0);
                    //top = top - (parseInt($el.css('margin-top'),10) || 0) - (parseInt($el.css('border-top'),10) || 0);

                    return {
                        top: top,
                        left: left
                    };
                }

                function inPixels(value) {
                    return value + 'px';
                }

                function cancelDocumentSelection(event) {
                    event.preventDefault && event.preventDefault();
                    event.stopPropagation && event.stopPropagation();
                    event.returnValue = false;
                    return false;
                }

                function repositionElement(event) {
                    var style = currentElement.style;
                    var elementXPosition = parseInt(style.left, 10);
                    var elementYPosition = parseInt(style.top, 10);

                    var elementNewXPosition = elementXPosition + (event.clientX - currentElement.lastXPosition);
                    var elementNewYPosition = elementYPosition + (event.clientY - currentElement.lastYPosition);

                    style.left = inPixels(elementNewXPosition);
                    style.top = inPixels(elementNewYPosition);

                    currentElement.lastXPosition = event.clientX;
                    currentElement.lastYPosition = event.clientY;

                    //triggerEvent('drag', { x: elementNewXPosition, y: elementNewYPosition, mouseEvent: event });
                }

                function removeDocumentListeners(event) {
                    //doc.off('selectstart', cancelDocumentSelection);
                    doc.off('mousemove', repositionElement);
                    doc.off('mouseup', removeDocumentListeners);
                }


            });
        }
    });

})(jQuery);
