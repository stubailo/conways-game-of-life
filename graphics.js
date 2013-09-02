var Pad = function (canvas) {
    var DEFAULT_LINE_WIDTH = 4;
    var DEFAULT_POINT_RADIUS = 5;

    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    
    return {
        draw_point: function (coord, radius, color) {
            context.beginPath();        
            context.arc(coord.x, coord.y, (radius) ? radius : DEFAULT_POINT_RADIUS, 0, Math.PI*2, true); 
            context.closePath();
            context.fill();
	        	if (color)
	    	        context.strokeStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
	    	    context.stroke(); 
        },
        draw_line: function (from, to, line_width, color) {
        	context.beginPath();
        	context.moveTo(from.x, from.y);
        	context.lineTo(to.x, to.y);
        	if (color)
    	        context.strokeStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
          context.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
    	    context.stroke(); 
        },
        clear: function () {
            context.clearRect(0, 0, width, height);
        },
        get_width: function () {return width;},
        get_height: function () {return height;}
    }
}