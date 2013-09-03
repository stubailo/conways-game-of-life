var Coord = function (x, y) {
    return {x:x, y:y};
};

var Color = function (red, green, blue) {
    return {red: red, green: green, blue: blue};
};

var Pad = function (canvas) {
    var DEFAULT_CIRCLE_RADIUS = 5;
    var DEFAULT_LINE_WIDTH = 2;

    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    var apply_line_width = function (ctx, line_width) {
        ctx.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
    }

    var apply_color = function (ctx, color) {
        if (color) {
            ctx.strokeStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
        }
    }

    var apply_fill_color = function (ctx, color) {
        if (color) {
            ctx.fillStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
	    ctx.fill();
        }
    }

    return {
        draw_circle: function (coord, radius, line_width, color, fill_color) {
            context.beginPath();
            context.arc(coord.x, coord.y,
                        (radius) ? radius : DEFAULT_CIRCLE_RADIUS,
                        0, Math.PI*2, true);
            context.closePath();
            apply_line_width(context, line_width);
            apply_color(context, color);
            apply_fill_color(context, fill_color);
            context.stroke();
        },

        draw_line: function (from, to, line_width, color) {
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            apply_line_width(context, line_width);
            apply_color(context, color);
            context.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
            context.fill();
            context.closePath();
            context.stroke();
        },

        draw_rectangle: function (top_left, width, height, line_width, color) {
            context.beginPath();
            context.rect(top_left.x, top_left.y, width, height);
            apply_line_width(context, line_width);
            apply_color(context, color);
            context.closePath();
            context.stroke();
        },

        clear: function () {
            context.clearRect(0, 0, width, height);
        },

        get_width: function () {return width;},
        get_height: function () {return height;}
    }
}