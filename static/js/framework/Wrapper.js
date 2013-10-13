window.Wrapper = function(e) {

	var TAP = "tap";

	var hw = true;
	var element = e;

	var px = 0, py = 0, pz = 0;
	var rx = 0, ry = 0, rz = 0;
	var sx = 1, sy = 1;

	var applyTransform = function() {

		var t = "translate3d(" + px + "px," + py + "px," + pz + "px) ";
		var s = "scale(" + sx + "," + sy + ") ";
		var r = "rotateX(" + rx + "deg) rotateY(" + ry + "deg) rotateZ(" + rz + "deg)";

		element.style.webkitTransform = t + s + r;
		element.style.transform = t + s + r;
	}

	this.move = function(x, y, z) {
		px = x || 0;
		py = y || 0;
		pz = z || 0;
		applyTransform();
	}

	this.rotate = function(x, y, z) {
		rx = x || 0;
		ry = y || 0;
		rz = z || 0;
		applyTransform();
	}

	this.scale = function(x, y) {
		sx = x || 1;
		sy = y || 1;
		applyTransform();
	}

	this.moveBy = function(x, y, z) {
		px += x || 0;
		py += y || 0;
		pz += z || 0;
		applyTransform();
	}

	this.height = function() {
		// return element.offsetHeight;
		return element.scrollHeight;
	}

	this.position = function() {
	    var el = element;
	    for (var lx=0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
	    return { x: lx, y: ly };
	}

	this.css = function(p, v) {
		if(!p) return element.style;
		else element.style[p] = v;
	}

	this.domElement = function() {
		return element;
	}

	this.on = function(m, f) {
		if(m == TAP) {

			f.tapHandler = (function() {

				var th = {};
				var minTime = 20000;
				var startTime;
				var minDistSq = 100;
				var sx, sy;

				th.touchStart = function(e) {
					startTime = new Date().getTime();
					sx = e.targetTouches[0].pageX;
					sy = e.targetTouches[0].pageY;
				}

				th.touchEnd = function(e) {
					var t = new Date().getTime() - startTime;

					var dx = e.changedTouches[0].pageX - sx;
					var dy = e.changedTouches[0].pageY - sy;
					var dsq = (dx*dx + dy*dy);

					if(t < minTime && dsq < minDistSq) f();
				}

				return th;

			})();

			element.addEventListener("touchstart", f.tapHandler.touchStart);
			element.addEventListener("touchend", f.tapHandler.touchEnd);

		} else {
			element.addEventListener(m, f);
		}
	}

	this.off = function(m, f) {
		element.removeEventListener(m, f);
	}
}

Wrapper.create = function(tag) {
	return new Wrapper(document.createElement(tag));
}

Wrapper.select = function(sel) {
	var e = document.querySelector(sel);
	if(e) return new Wrapper(e);
	else return null;
}

Wrapper.selectAll = function(sel) {
	var es = document.querySelectorAll(sel), ws = []

	for(var i = 0; i < es.length; i++) {
		ws.push(new Wrapper(es[i]));
	}
	
	return ws;
}














