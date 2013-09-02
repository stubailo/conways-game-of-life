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

    function apply_line_width(ctx, line_width) {
        ctx.lineWidth = (line_width) ? line_width : DEFAULT_LINE_WIDTH;
    }

    function apply_color(ctx, color) {
        if (color) {
            ctx.strokeStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
        }
    }

    function apply_fill_color(ctx, color) {
        if (color) {
            ctx.fillStyle = 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ', 1)';
        }
    }

    return {
        draw_circle: function(coord, radius, line_width, color, fill_color) {
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

       draw_point: function (coord, color) {
           this.draw_circle(coord, 1, 1, color, color);
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

        draw_square: function (top_left, side_length, line_width, color) {
            this.draw_rectangle(top_left, side_length, side_length, line_width, color);
        },

        clear: function () {
            context.clearRect(0, 0, width, height);
        },

        get_width: function () {return width;},
        get_height: function () {return height;}
    }
}