!(function(a,b){if(typeof define==="function"&&typeof define.amd==="object"){define(b);this[a]=b();}else{this[a]=b();}})("draggable",function definition(){var g;function m(n,o){if(!n){return;}o=o||n;f(n);e(n);$(o).on("mousedown",function(p){k(p,n);});}function f(n){n.style.position="absolute";}function e(n){n.draggableListeners={start:[],drag:[],stop:[]};n.whenDragStarts=b(n,"start");n.whenDragging=b(n,"drag");n.whenDragStops=b(n,"stop");}function k(q,p){g=p;var n=l(g);g.style.left=d(n.left);g.style.top=d(n.top);g.lastXPosition=q.clientX;g.lastYPosition=q.clientY;var o=j("start",{x:n.left,y:n.top,mouseEvent:q});if(!o){return;}i();}function b(n,o){return function(p){n.draggableListeners[o].push(p);};}function j(r,o){var n=true;var q=g.draggableListeners[r];for(var p=q.length-1;p>=0;p--){if(q[p](o)===false){n=false;}}return n;}function i(){var n=$(document);n.on("selectstart",a);n.on("mousemove",h);n.on("mouseup",c);}function l(p){var r=0;var q=0;var o=$(p);var n=p;do{r+=n.offsetTop;q+=n.offsetLeft;}while(n=n.offsetParent);q=q-(parseInt(o.css("margin-left"),10)||0)-(parseInt(o.css("border-left"),10)||0);r=r-(parseInt(o.css("margin-top"),10)||0)-(parseInt(o.css("border-top"),10)||0);return{top:r,left:q};}function d(n){return n+"px";}function a(n){n.preventDefault&&n.preventDefault();n.stopPropagation&&n.stopPropagation();n.returnValue=false;return false;}function h(q){var p=g.style;var r=parseInt(p.left,10);var s=parseInt(p.top,10);var o=r+(q.clientX-g.lastXPosition);var n=s+(q.clientY-g.lastYPosition);p.left=d(o);p.top=d(n);g.lastXPosition=q.clientX;g.lastYPosition=q.clientY;j("drag",{x:o,y:n,mouseEvent:q});}function c(n){var q=$(document);q.off("selectstart",a);q.off("mousemove",h);q.off("mouseup",c);var p=parseInt(g.style.left,10);var o=parseInt(g.style.top,10);j("stop",{x:p,y:o,mouseEvent:n});}return m;});
