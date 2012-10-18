/**
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
// collection of points
var Points = function() {
	var self 	= this;
	var _points = [];

	self.add = function(point) {
		_points.push(point);
	};

	self.append = function(other){
		other.each(function(p, i){
			self.add(p);
		});
	};

	self.contains = function(point){
		var result = false;
		for(var i = 0; i < _points.length; i++){
			var each = _points[i];
			if(each.x == point.x
				&& each.y == point.y){
				result = true;
				break;
			}
		}

		return result;
	};


	self.addIfAbsent = function(point){
		if(!self.contains(point)){
			self.add(point);
			return true;
		}

		return false;
	};

	self.point = function(idx){
		return _points[idx];
	};

	self.size = function(){
		return _points.length;
	};

	self.log = function(){
		console.log(_points);
	};

	self.each = function(callback) {
		var len = _points.length;
		for(var i = 0; i < len; i++){
			var p = _points[i];
			callback.call(p, p, i, i === 0, i === len-1);
		}
	};

	self.backEach = function(callback){
		var len = _points.length;
		for(var i = len - 1; i >= 0; i--){
			var p = _points[i];
			callback.call(p, p, i, i === 0, i === len-1);
		}
	};

};

Points.of = function(pointsArray){
	var ret = new Points();
	pointsArray.forEach(function(each){
		ret.add(Point.make(each.x, each.y));
	});

	return ret;
};

Points.fromPath = function(pathArray) {
	var ret = new Points();
	pathArray.forEach(function(action) {
		var length = action.length
		if(length > 2) {
			/* For all SVG paths we are using so far (M, C, L), the coordinates of vertices
			 * are always the last two numbers of each path element
			 */
			ret.add(Point.make(action[length-2], action[length-1]));
		}
	});
	return ret;
};