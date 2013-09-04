// a very simple graphics library using HTML5 canvas features

// constructor for 2D coordinate
var Coord = function (x, y) {
	return {x:x, y:y};
	};

// constructor for color
var Color = function (red, green, blue) {
	return {red: red, green: green, blue: blue};
	};

// an abstraction for drawing in a canvas
var Pad = function (canvas) {
	var DEFAULT_CIRCLE_RADIUS = 5;
	var DEFAULT_LINE_WIDTH = 2;

	var context = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;

	// sets the line width for subsequent drawing
	var apply_line_width = function (ctx, line_width) {
		ctx.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
		}

	// sets the color for subsequent drawing and a default stroke width
	var apply_color = function (ctx, color) {
		if (color) {
			ctx.strokeStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
			}
		}

	// sets the fill color for subsequent drawing
	var apply_fill_color = function (ctx, color) {
		if (color) {
			ctx.fillStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
			ctx.fill();
			}
		}

	// return the abstract object from the constructor

	return {
		// Draws a circle at the given coordinate (as returned by the
		// Coord function) of the given radius (defaulting to
		// DEFAULT_CIRCLE_RADIUS if the radius is 0 or omitted). An
		// optional line width can be supplied (defaults to
		// DEFAULT_LINE_WIDTH otherwise), as well as an optional color
		// and fill color (both objects returned by the Color
		// function).
		draw_circle: function(coord, radius, line_width, color, fill_color) {
			context.beginPath();
			context.arc(coord.x, coord.y, (radius) ? radius : DEFAULT_CIRCLE_RADIUS, 0, Math.PI * 2, true);
			context.closePath();
			apply_line_width(context, line_width);
			apply_color(context, color);
			apply_fill_color(context, fill_color);
			context.stroke();
			},

		// Draws a line between the given coordinates (as returned by
		// the Coord function). An optional line width can be supplied
		// (defaults to DEFAULT_LINE_WIDTH otherwise), as well as an
		// optional color (returned by the Color function).
		draw_line: function(from, to, line_width, color) {
			context.beginPath();
			context.moveTo(from.x, from.y);
			context.lineTo(to.x, to.y);
			apply_line_width(context, line_width);
			apply_color(context, color);
			context.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
			context.closePath();
			context.stroke();
			},

		// Draws a rectangle starting at the top left corner (as
		// returned by the Coord function) of the given width and
		// height. An optional line width can be supplied (defaults to
		// DEFAULT_LINE_WIDTH otherwise), as well as an optional color
		// and fill color (both returned by the Color function).
		draw_rectangle: function(top_left, width, height, line_width, color, fill_color) {
			context.beginPath();
			context.rect(top_left.x, top_left.y, width, height);
			apply_line_width(context, line_width);
			apply_color(context, color);
			apply_fill_color(context, fill_color);
			context.closePath();
			context.stroke();
			},

		// Clears the entire board
		clear: function() {
			context.clearRect(0, 0, width, height);
			},

		// return width and height of the drawing area
		get_width: function() {
			return width;
			},
		get_height: function() {
			return height;
			}
	}
}