/**
 * @author hsanchez@cs.ucsc.edu (Huascar A. Sanchez)
 */
function MakeParts(data) {
	var radio 		= data.app; 				// data must have this radio...otherwise, we are doomed.
	var sc			= data.sort || "minside"; 	// sorting criteria

	// Helper object for sorting
	var Sort = {
		random  : function (a,b) { return Math.random() - 0.5; },
		w       : function (a,b) { return b.w - a.w; },
		h       : function (a,b) { return b.h - a.h; },
		a       : function (a,b) { return b.area - a.area; },
		max     : function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
		min     : function (a,b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },

		height  : function (a,b) { return Sort.msort(a, b, ['h', 'w']);               },
		width   : function (a,b) { return Sort.msort(a, b, ['w', 'h']);               },
		area    : function (a,b) { return Sort.msort(a, b, ['a', 'h', 'w']);          },
		maxside : function (a,b) { return Sort.msort(a, b, ['max', 'min', 'height']); },
		minside : function (a,b) { return Sort.msort(a, b, ['min', 'max', 'area']);   },

		/* Helper method that will allow us to sort by multiple sorting criteria,
		   e.g., max, min, etc. */
		msort: function(a, b, criteria) {
			var diff, n;
			for (n = 0 ; n < criteria.length ; n++) {
				diff = Sort[criteria[n]](a,b);
				if (diff != 0)
					return diff;
			}
			return 0;
		},

		now: function(parts) {
			if (sc != 'none')
				parts.sort(Sort[sc]);
		}
	};

	// Helper object for making parts
	var Make = {
		makeSensor: function(parts, criteria, partsSpec) {
			partsSpec.sensor[criteria].forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = "Sensor";
				var part       = Sensor({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				parts.push(part);
			});
		},

		clusters: function(partsSpec){
			// 1st cluster
			var ONE = [];
			partsSpec.microcontroller.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = Microcontroller({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				ONE.push(part);
			});

			partsSpec.batteryPack.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = BatteryPack({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				ONE.push(part);
			});

			// 2nd cluster
			var w1 = Wheel({id: new Date().getTime(), app: radio});
			var w2 = Wheel({id: new Date().getTime(), app: radio});
			var TWO = [];
			TWO.push(w1);
			TWO.push(w2);

			// 3rd cluster
			var THREE = [];
			this.makeSensor(THREE, 'light', partsSpec);
			this.makeSensor(THREE, 'motion', partsSpec);

			// 4th cluster
			var FOUR = [];
			var w3 = Wheel({id: new Date().getTime(), app: radio});
			partsSpec.motor.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = Motor({name:name, app: radio, dimensions: dimensions});
				FOUR.push(part);
			});

			FOUR.push(w3);

			// 5th cluster
			var FIVE = [];
			this.makeSensor(FIVE, 'light', partsSpec);

			return [ONE, TWO, THREE, FOUR, FIVE];
		},

		now: function(partsSpec) {
			var parts = [];
			// 1. make microcontrollers
			partsSpec.microcontroller.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = Microcontroller({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				parts.push(part);
			});

			// 2. make sensors
			this.makeSensor(parts, 'light', partsSpec);
			this.makeSensor(parts, 'motion', partsSpec);

			// 3. make power amplifiers
			partsSpec.power.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = PowerAmplifier({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				parts.push(part);
			});

			// 4. make battery packs
			partsSpec.batteryPack.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = BatteryPack({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				parts.push(part);
			});

			partsSpec.motor.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = each.name;
				var part	   = Motor({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				parts.push(part);
			});

			return parts;
		},

		necessary: function(partsSpec){
			var ONE = [];
			partsSpec.microcontroller.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = "Microcontroller";
				var part	   = Microcontroller({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				ONE.push(part);
			});

			partsSpec.batteryPack.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = "BatteryPack";
				var part	   = BatteryPack({name:name, app: radio, dimensions: dimensions});
				part.area	   = part.w * part.h;
				ONE.push(part);
			});

			var w1 = Wheel({id: new Date().getTime(), app: radio});
			var w2 = Wheel({id: new Date().getTime(), app: radio});
			ONE.push(w1);
			ONE.push(w2);

			this.makeSensor(ONE, 'light', partsSpec);
			this.makeSensor(ONE, 'motion', partsSpec);


			partsSpec.motor.forEach(function(each){
				var dimensions = { w:each.width, h:each.height, d:0 };
				var name	   = "Servo";
				var part	   = Motor({name:name, app: radio, dimensions: dimensions});
				ONE.push(part);
			});


			return ONE;
		}
	};

	var self = {
		sort: function(parts) {
			Sort.now(parts);
			return parts;
		},

		make: function() {
			return self.sort(Make.necessary(SpecSheet.parts));
		}
	};

	Mixable(self).mix(Algorithm (data));
	return self.make();
}