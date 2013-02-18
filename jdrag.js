!(function(moduleName, definition) {
    // Whether to expose Draggable as an AMD module or to the global object.
    if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
    else this[moduleName] = definition();

})('draggable', function definition() {
    var currentElement;

    function draggable(element, handle) {
        if (!element) {
            return;
        }
        handle = handle || element;
        setPositionType(element);
        setDraggableListeners(element);
        $(handle).on('mousedown', function(event) {
            startDragging(event, element);
        });
    }

    function setPositionType(element) {
        element.style.position = 'absolute';
    }

    function setDraggableListeners(element) {
        element.draggableListeners = {
            start: [],
            drag: [],
            stop: []
        };
        element.whenDragStarts = addListener(element, 'start');
        element.whenDragging = addListener(element, 'drag');
        element.whenDragStops = addListener(element, 'stop');
    }

    function startDragging(event, element) {
        //currentElement && sendToBack(currentElement);
        currentElement = element;


        var initialPosition = getInitialPosition(currentElement);
        currentElement.style.left = inPixels(initialPosition.left);
        currentElement.style.top = inPixels(initialPosition.top);
        currentElement.lastXPosition = event.clientX;
        currentElement.lastYPosition = event.clientY;

        var okToGoOn = triggerEvent('start', { x: initialPosition.left, y: initialPosition.top, mouseEvent: event });
        if (!okToGoOn) {
            return;
        }

        addDocumentListeners();
    }

    function addListener(element, type) {
        return function(listener) {
            element.draggableListeners[type].push(listener);
        };
    }

    function triggerEvent(type, args) {
        var result = true;
        var listeners = currentElement.draggableListeners[type];
        for (var i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i](args) === false) result = false;
        };
        return result;
    }

    function addDocumentListeners() {
        var doc = $(document);
        doc.on('selectstart', cancelDocumentSelection);
        doc.on('mousemove', repositionElement);
        doc.on('mouseup', removeDocumentListeners);
    }

    function getInitialPosition(element) {
        var top = 0;
        var left = 0;
        var $el = $(element);
        var currentElement = element;
        do {
            top += currentElement.offsetTop;
            left +=  currentElement.offsetLeft;
        } while (currentElement = currentElement.offsetParent);

        left = left - (parseInt($el.css('margin-left'),10) || 0) - (parseInt($el.css('border-left'),10) || 0);
        top = top - (parseInt($el.css('margin-top'),10) || 0) - (parseInt($el.css('border-top'),10) || 0);

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

        triggerEvent('drag', { x: elementNewXPosition, y: elementNewYPosition, mouseEvent: event });
    }

    function removeDocumentListeners(event) {
        var doc = $(document);
        doc.off('selectstart', cancelDocumentSelection);
        doc.off('mousemove', repositionElement);
        doc.off('mouseup', removeDocumentListeners);

        var left = parseInt(currentElement.style.left, 10);
        var top = parseInt(currentElement.style.top, 10);
        triggerEvent('stop', { x: left, y: top, mouseEvent: event });
    }
    return draggable;
});
