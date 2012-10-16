var Cell = function(x, y, i, j, angle, space){
	var self = this;

	var corners = [
		Point.make(x, y), 					// top left
		Point.make(x + space, y), 			// top right
		Point.make(x + space, y + space), 	// bottom right
		Point.make(x, y + space)			// bottom left
	];

	self.angle   = angle;
	self.free  	 = true;
	self.taken   = !self.free;
	self.valid   = false;
	self.corners = Points.of(corners);
	self.i       = i;
	self.j       = j;
	self.w       = space;
	self.h       = space;
	self.center  = CalculateCenter(
		self.corners.point(0), self.corners.point(2)
	);
	self.distanceTo = function(cell){
		this.corners.point(0).distanceTo(cell.corners.point(0));
	};
	self.part    = null;
	self.name    = self.part != null ? self.part.name : "none";

}; Cell.isValid = function(path, cell, N){
	// return true if all the points are inside the chassis.
	var result = false;

	if((cell.j == 0 || cell.j == N - 1) || (cell.i == N - 1)){
		var counter = 0;
		cell.corners.each(function(p){
			if(Geometry.isInside(path, p)){
				result = true;
				counter++;
			}
		});

		if(counter == 2) result = true;

	} else {
		cell.corners.each(function(p){
			if(Geometry.isInside(path, p)){
				result = true;
			}
		});
	}


	return result;
};

Cell.copy = function(cell){
	return new Cell(cell.x, cell.y, cell.i, cell.j, cell.angle, cell.w);
};

var Solution = function(){
	var elements = [];
	return {
		add: function(cell){
			elements.push(cell);
		},

		find: function(i, j){
			var result = null;
			elements.forEach(function(each){
				if(each.i == i && each.j == j){
					result = each;
				}
			});

			return result;
		},

		score: function(){
			// todo(Huascar) once I found the problem with Geometry.isInside
			// I will implement this.
			return 1;
		},

		size: function(){
			return elements.length;
		},

		at: function(idx){
			return elements[idx];
		},

		contains: function(i, j, name){
			var result = false;
			var part   = this.find(i, j);

			if(part != null){
				result = part.name == name;
			}

			return result;
		},

		union: function(sol){
			var result 	= Solution();
			var N 		= Math.max(this.size(), sol.size());

			for(var i = 0; i < N; i++){
				var c = this.at(i);
				var o = sol.at(i);
				if(c){
					if(o){
						if(o != c){
							result.add(c);
							result.add(o);
						} else {
							result.add(c);
						}
					} else {
						result.add(c);
					}
				} else {
					result.add(o);
				}
			}
			return result;
		}
	};
}; Solution.merge = function(sols){
	var all = Solution();
	var N   = sols.length;

	for(var i = 0; i < N; i++){
		var each = sols[i];
		all = all.union(each);
	}

	return all;
};

var walk = function(grid, full, t, horizontal, bag, SPACE){
	var taken = null;
	var N     = grid.length;
	for(var f = 0; f < N; f++){
		var each = horizontal ? grid[t][f] : grid[f][t];
		if(!each.valid) continue;
		if(!each.free)  continue;

		if(taken != null){
			if(taken.distanceTo(each) < SPACE) continue;
		}

		var part = bag.pop();
		if(!part) continue;

		each.free = false;
		each.part = part;
		taken     = each;
		full.add(Cell.copy(taken));
	}
};

var pack = function(elem){
	var result = [];
	result.push(elem);
	return result;
};

var isConsistent = function(i, j, N){
	if (i < 1 || i >= N - 1) return false;    // invalid row
	if (j < 1 || j >= N - 1) return false;    // invalid column
	return true;
};

var Enumerate = {
	all: function(grid, full, leftover, lo, hi){
		var solutions 	= [];
		var N 			= grid.length;
		var part        = null;
		while(lo < N){
			for(var j = 1; j < hi; j++){
				var sol  = Solution();
				var each = grid[lo][j];
				if(!each.valid) continue;

				// place cpu
				part 		 = leftover.cpu;
				each.free = true;
				each.part = part;
				sol.add(Cell.copy(each));

				var eachBattery = null;
				var eachSol		 = null;
				// down
				if(isConsistent(lo + 1, j, hi)){
					eachSol				 = Solution();
					eachBattery 		 = grid[lo + 1][j];
					if(eachBattery.free) {
						part    	   		 = leftover.battery;
						eachBattery.free     = true;
						eachBattery.part     = part;
						eachSol.add(Cell.copy(eachBattery));
						solutions.push(Solution.merge([full, sol, eachSol]));
						eachSol				 = null;
					}
				}
				// right
				if(isConsistent(lo, j + 1, hi)){
					eachSol				 = Solution();
					eachBattery 		 = grid[lo][j + 1];
					if(eachBattery.free) {
						part    	   		 = leftover.battery;
						eachBattery.free     = true;
						eachBattery.part     = part;
						eachSol.add(Cell.copy(eachBattery));

						solutions.push(Solution.merge([full, sol, eachSol]));
						eachSol				 = null;
					}
				}
				// left
				if(isConsistent(lo, j - 1, hi)){
					eachSol				 = Solution();
					eachBattery 		 = grid[lo][j - 1];
					if(eachBattery.free) {
						part    	   		 = leftover.battery;
						eachBattery.free     = true;
						eachBattery.part     = part;
						eachSol.add(Cell.copy(eachBattery));

						solutions.push(Solution.merge([full, sol, eachSol]));

						eachSol				 = null;
					}
				}
				// up
				if(isConsistent(lo - 1, j, hi)){
					eachSol				 = Solution();
					eachBattery 		 = grid[lo - 1][j];
					if(eachBattery.free) {
						part    	   		 = leftover.battery;
						eachBattery.free     = true;
						eachBattery.part     = part;
						eachSol.add(Cell.copy(eachBattery));

						solutions.push(Solution.merge([full, sol, eachSol]));

						eachSol				 = null;
					}
				}

			} lo++;
		}

		return $.extend(true, [], solutions);
	}
};
