function SidePanelHandler(view, options) {
	var self = {
		userEvents: ['click'],
		appEvents: ['selectionChanged'],
		
		enable: function() {
			var thisHandler = this;
			thisHandler.appEvents.forEach(function(ev){
			    self.bind(Events[ev], thisHandler[ev]);
			});
			thisHandler.userEvents.forEach(function(ev){
			    view.bind(Events[ev], thisHandler[ev]);
			});			
		},
		
		disable: function() {
			var thisHandler = this;
			thisHandler.appEvents.forEach(function(ev){
			    self.unbind(Events[ev], thisHandler[ev]);
			});
			thisHandler.userEvents.forEach(function(ev){
			    view.unbind(Events[ev], thisHandler[ev]);
			});			
		},

		click: function(payload) {
			payload.event.preventDefault();
			var target 	= $(payload.event.target),
				varName	= target.data('guivar');
			var varVal  = target.data ('guival');
			view.select(target);
			var pl = {};
			pl[varName] = varVal;
			self.trigger(Events.optionChanged, pl);
		},
		
		selectionChanged: function(payload) {
			var color;
			var colorRGB = payload.target.getColor();
			switch(colorRGB) {
				case '#FF0000': color = 'red'; break;
				case '#00FF00': color = 'green'; break;
				case '#FFFFFF': color = 'white'; break;
				default: color = 'default';
			}
			view.setColor(color);
		}
	};
	
	Mixable(self).mix(EventHandler(view, options));
	return self;
}