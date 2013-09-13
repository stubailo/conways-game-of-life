/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global Color: false, Coord: false, Pad: false */

(function () {
  "use strict";

  var Conway = {};

  //////////////////// Rendering

  // draw a grid of cells on the pad - black rectangle for true, white for false
  function draw_cells(pad, grid, cell_width, cell_height) {
    var black = Color(0, 0, 0),
      white = Color(255, 255, 255),
      x,
      y,
      column,
      cell;

    pad.clear();
    for (x = 0; x < grid.length; x++) {
      column = grid[x];
      for (y = 0; y < column.length; y++) {
        cell = column[y];
        if (cell) {
          pad.draw_rectangle(Coord(x * cell_width, y * cell_height), cell_width, cell_height, 1, white, black);
        }
      }
    }
  }


  //////////////////// Utilities

  // check if the cell is alive; if the index is out of the grid, default to dead
  function is_alive(grid, x, y) {
    if (0 <= x && x < grid.length && 0 <= y && y < grid[x].length) {
      return grid[x][y];
    }

    return false;
  }

  // count how many live neighbors a cell has
  function sum_neighbors(grid, x, y) {
    // directions to reach all of the neighbors
    var sum = 0, neighbor_x, neighbor_y,
      directions = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
      ];

    directions.forEach(function (direction) {
      neighbor_x = direction[0] + x;
      neighbor_y = direction[1] + y;

      if (is_alive(grid, neighbor_x, neighbor_y)) {
        sum++;
      }
    });

    return sum;
  }

  // get the next state of a cell
  function get_new_state(grid, x, y) {
    var sum = sum_neighbors(grid, x, y),
      alive = is_alive(grid, x, y);

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
    var x,
      y,
      output_grid = [],
      new_row;

    for (x = 0; x < grid.length; x++) {
      new_row = [];
      output_grid.push(new_row);

      for (y = 0; y < grid[x].length; y++) {
        new_row.push(get_new_state(grid, x, y));
      }
    }

    return output_grid;
  }


  ///////////////////// Parsing URL options

  // parses starting grid in the form 1101,1011,0011,0101 where each row is 1s and 0s, rows separated by commas
  function parse_starting_grid(url_string) {
    var grid = [],
      rows = url_string.split(","),
      new_row;

    rows.forEach(function (row) {
      new_row = [];
      row.split("").forEach(function (cell) {
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
    var options = {},
      hash_text,
      pairs,
      split;

    if (!window.location.hash) {
      return options;
    }

    hash_text = window.location.hash.slice(1);
    pairs = hash_text.split("&");

    pairs.forEach(function (pair) {
      split = pair.split("=");
      if (split[0] === "grid") {
        options[split[0]] = parse_starting_grid(split[1]);
      } else {
        options[split[0]] = split[1];
      }
    });
    return options;
  }

  // merges a dictionary with a second one, with the second taking precedence
  function merge_options(first, override) {
    var key;

    for (key in override) {
      if (override.hasOwnProperty(key)) {
        first[key] = override[key];
      }
    }
  }

  // see if hash has changed; if so then refresh page.  Comes with global var to keep track of previous hash
  window.prev_hash = window.location.hash;
  function check_hash() {
    if (window.location.hash !== window.prev_hash) {
      window.location.reload();
    }
  }


  ///////////////////// Putting it all together

  function run_game() {
    var dimensions,
      pad = Pad(document.getElementById('canvas')),
      cell_width,
      cell_height,
      curr_grid,
      options = {
        grid: parse_starting_grid("0010,1001,1001,0100"),
        size_x: 10,
        size_y: 10,
        interval: 1000
      };

    merge_options(options, parse_URL_hash());

    // set starting state
    curr_grid = options.grid;

    // number of cells to draw
    dimensions = {
      x: options.size_x,
      y: options.size_y
    };

    // calculate size of each cell based on number of cells and canvas size
    cell_width = pad.get_width() / dimensions.x;
    cell_height = pad.get_height() / dimensions.y;

    // initial render
    draw_cells(pad, curr_grid, cell_width, cell_height);

    setInterval(function () {
      curr_grid = step_conway(curr_grid);
      draw_cells(pad, curr_grid, cell_width, cell_height);
    }, options.interval);

    setInterval(check_hash, 50);
  }

  Conway.run_game = run_game;

  window.Conway = Conway;
}());
