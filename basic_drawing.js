(function () {
    var black = Color(0,0,0);
    var red = Color(255,0,0);
    var green = Color(0,255,0);
    var blue = Color(0,0,255);
    
    pad = Pad(document.getElementById('canvas'));
    pad.clear();
    
    var MAX_X = 100;
    var MAX_Y = 100;
    var x_factor = pad.get_width() / MAX_X;
    var y_factor = pad.get_height() / MAX_Y;
  
    // draw a box
    pad.draw_rectangle(Coord(0, 0), pad.get_width(), pad.get_height(), 10, black);

    // draw some circles inside the box
    var RADIUS = 5;
    var LINE_WIDTH = 2;
    for (var i = 10; i < MAX_X; i = i + 10) {
	for (var j = 10; j < MAX_Y; j = j + 10) {
	    pad.draw_point(Coord(i*x_factor, j*y_factor), black);
	    if (i % 20 == j % 20) {
		pad.draw_circle(Coord(i*x_factor, j*y_factor),
				RADIUS, LINE_WIDTH, green);
	    } else {
		pad.draw_square(Coord(i*x_factor-RADIUS, j*y_factor-RADIUS),
				RADIUS*2, LINE_WIDTH, red);
	    }
	}
    }
    
}) ()
