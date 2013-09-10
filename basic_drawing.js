(function () {

  ///////////////////// Initializing variables

	// create the drawing pad object and associate with the canvas
	pad = Pad(document.getElementById('canvas'));
	pad.clear();
  
  // number of cells to draw
  var dimensions = {
    x: 10,
    y: 10
  };

  // calculate size of each cell based on number of cells and canvas size
  var cell_width = pad.get_width()/dimensions.x;
  var cell_height = pad.get_height()/dimensions.y;

	// define some colors
	var black = Color(0, 0, 0);
	var white = Color(255, 255, 255);
  
  // directions to reach all of the neighbors
  var directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ];


  //////////////////// Rendering

  // draw a grid of cells on the pad - black rectangle for true, white for false
  function draw_cells(grid) {
    pad.clear();
    var x, y, column, cell;
    for(x=0; x<grid.length; x++) {
      column = grid[x];
      for(y=0; y<column.length; y++) {
        cell = column[y];
        if(cell) {
          pad.draw_rectangle(Coord(x*cell_width, y*cell_height), cell_width, cell_height, 1, white, black);
        }
      }
    }
  };

  
  //////////////////// Utilities

  // check if the cell is alive; if the index is out of the grid, default to dead
  function is_alive(grid, x, y) {
    if (0 <= x && x < grid.length && 0 <= y && y < grid[x].length) {
      return grid[x][y];
    } else {
      return false;
    }
  }

  // count how many live neighbors a cell has
  function sum_neighbors(grid, x, y) {
    var sum = 0;
    var neighbor_x, neighbor_y;
    directions.forEach(function(direction) {
      neighbor_x = direction[0] + x;
      neighbor_y = direction[1] + y;

      if(is_alive(grid, neighbor_x, neighbor_y)) {
        sum++;
      }
    });

    return sum;
  }

  // get the next state of a cell
  function get_new_state(grid, x, y) {
    var sum = sum_neighbors(grid, x, y);
    var alive = is_alive(grid, x, y);
        
    if (alive && (sum < 2 || 3 < sum)) {
      // dies
      return false;
    } else if ((!alive) && sum === 3) {
      // is born
      return true;
    } else {
      // no change
      return alive;
    }
  }

  // run a step of conway's game of life, and return the new state
  function step_conway(grid) {
    var x, y, sum, alive;
    var output_grid = [];
    var new_row;
  
    for(x=0; x<grid.length; x++) {
      new_row = [];
      output_grid.push(new_row);

      for(y=0; y<grid[x].length; y++) {
        new_row.push(get_new_state(grid, x, y));
      }
    }

    return output_grid;
  }


  ///////////////////// Parsing URL options
  
  // parses starting grid in the form 1101,1011,0011,0101 where each row is 1s and 0s, rows separated by commas
  function parse_starting_grid(url_string) {
    var grid = [];
    var rows = url_string.split(",");
    var new_row;
    rows.forEach(function(row) {
      new_row = [];
      row.split("").forEach(function(cell) {
        if (cell === "1") {
          new_row.push(true);
        } else {
          new_row.push(false);
        }
      });
      grid.push(new_row);
    });

    return grid;
  }

  
  // parses URL-encoded options (key=val&key2=val2) in the hash, returns dictionary of option names to values
  function parse_URL_hash() {
    var options = {};
    var hash_text = window.location.hash.slice(1);

    var pairs = hash_text.split("&");
    var split;
    pairs.forEach(function(pair) {
      split = pair.split("=");
      if(split[0] === "grid") {
        options[split[0]] = parse_starting_grid(split[1]);
      } else {
        options[split[0]] = split[1];
      }
    });
    return options;
  }

 
  var DEFAULT_OPTIONS = {
    grid: "0010,1001,1001,0100"
  }

  ///////////////////// Running the code

  var options = parse_URL_hash();

  var curr_grid = options.grid;

  draw_cells(curr_grid);
  setInterval(function() {
    curr_grid = step_conway(curr_grid);
    draw_cells(curr_grid);
  }, 1000);

}) ();
