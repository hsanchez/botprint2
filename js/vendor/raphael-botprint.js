Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
	color = color || "#000";
	var path = ["M", x, y, "L", x + w, y, x + w, y + h, x, y + h, x, y],
		rowHeight = h / hv,
		columnWidth = w / wv;
	for (var i = 1; i < hv; i++) {
		path = path.concat(["M", x, y + i * rowHeight, "L", x + w, y + i * rowHeight]);
	}
	for (var i = 1; i < wv; i++) {
		path = path.concat(["M", x + i * columnWidth, y, "L", x + i * columnWidth, y + h]);
	}
	return this.path(path.join(",")).attr({stroke: color});
};

Raphael.el.isAbsolute = true;
Raphael.el.absolutely = function () {
	this.isAbsolute = 1;
	return this;
};
Raphael.el.relatively = function () {
	this.isAbsolute = 0;
	return this;
};
Raphael.el.moveTo = function (x, y) {
	this._last = {x: x, y: y};
	return this.attr({path: this.attrs.path + ["m", "M"][+this.isAbsolute] + parseFloat(x) + " " + parseFloat(y)});
};

Raphael.el.lineTo = function (x, y) {
	this._last = {x: x, y: y};
	return this.attr({path: this.attrs.path + ["l", "L"][+this.isAbsolute] + parseFloat(x) + " " + parseFloat(y)});
};

Raphael.el.vlineTo = function (x, y) {
	this._last = {x: x, y: y};
	return this.attr({path: this.attrs.path + ["v", "V"][+this.isAbsolute] + parseFloat(y)});
};


Raphael.el.arcTo = function (rx, ry, large_arc_flag, sweep_flag, x, y, angle) {
	this._last = {x: x, y: y};
	return this.attr({path: this.attrs.path + ["a", "A"][+this.isAbsolute] + [parseFloat(rx), parseFloat(ry), +angle, large_arc_flag, sweep_flag, parseFloat(x), parseFloat(y)].join(" ")});
};
Raphael.el.curveTo = function () {
	var args = Array.prototype.splice.call(arguments, 0, arguments.length),
		d = [0, 0, 0, 0, "s", 0, "c"][args.length] || "";
	this.isAbsolute && (d = d.toUpperCase());
	this._last = {x: args[args.length - 2], y: args[args.length - 1]};
	return this.attr({path: this.attrs.path + d + args});
};
Raphael.el.cplineTo = function (x, y, w) {
	this.attr({path: this.attrs.path + ["C", this._last.x + w, this._last.y, x - w, y, x, y]});
	this._last = {x: x, y: y};
	return this;
};
Raphael.el.qcurveTo = function () {
	var d = [0, 1, "t", 3, "q"][arguments.length],
		args = Array.prototype.splice.call(arguments, 0, arguments.length);
	if (this.isAbsolute) {
		d = d.toUpperCase();
	}
	this._last = {x: args[args.length - 2], y: args[args.length - 1]};
	return this.attr({path: this.attrs.path + d + args});
};
Raphael.el.addRoundedCorner = function (r, dir) {
	var rollback = this.isAbsolute;
	rollback && this.relatively();
	this._last = {x: r * (!!(dir.indexOf("r") + 1) * 2 - 1), y: r * (!!(dir.indexOf("d") + 1) * 2 - 1)};
	this.arcTo(r, r, 0, {"lu": 1, "rd": 1, "ur": 1, "dl": 1}[dir] || 0, this._last.x, this._last.y);
	rollback && this.absolutely();
	return this;
};
Raphael.el.andClose = function () {
	return this.attr({path: this.attrs.path + "z"});
};
