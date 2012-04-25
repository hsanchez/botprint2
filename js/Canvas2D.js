/**
 * @author Zhongpeng Lin
 */

function Canvas2D(elemID) {
	this.elem = $('#'+elemID);
	var width = this.elem.width();
	var height = this.elem.height();
	var draw = Raphael(elemID, width, height);
	var pos = this.elem.offset();
	this.offset = [pos.left, pos.top];
	
	this.setHandler(new RectangleHandler(draw));
    
    this.width = width;
    this.height = height;
}

Canvas2D.prototype.setHandler = function(handler) {
	var self = this;
	this.elem.mousedown(function(event){
      event.preventDefault();
      handler.onMouseDown(self.translateX(event.clientX), self.translateY(event.clientY));
    });

	this.elem.mousemove(function(event){
      event.preventDefault();
      handler.onMouseMove(self.translateX(event.clientX), self.translateY(event.clientY));
    });

	this.elem.mouseup(function(event){
      event.preventDefault();
      handler.onMouseUp(self.translateX(event.clientX), self.translateY(event.clientY));
    });
    
    this.handler = handler;
};

Canvas2D.prototype.getCurrentShape = function() {
	return this.handler.current;
};

Canvas2D.prototype.translateX = function(x) {
	return x - this.offset[0];
};

Canvas2D.prototype.translateY = function(y) {
	return y - this.offset[1];
};
