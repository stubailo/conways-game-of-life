/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global ConwayOptions: false, Color: false, Coord: false, Pad: false */

(function () {
  "use strict";

  var ConwayUtils = {

    //////////////////// Rendering

    // draw a grid of cells on the pad - black rectangle for true, white for false
    draw_cells: function (pad, grid, cell_width, cell_height) {
      var black = Color(0, 0, 0),
        white = Color(255, 255, 255);

      pad.clear();

      // use for loop because indices are used for drawing
      grid.forEach(function (row, x) {
        row.forEach(function (cell, y) {
          var corner;

          if (cell) {
            corner = Coord(x * cell_width, y * cell_height);
            pad.draw_rectangle(corner, cell_width, cell_height, 1, white, black);
          }

        });
      });
    },


    //////////////////// Utilities

    // check if the cell is alive; if the index is out of the grid, default to dead
    is_alive: function (grid, x, y) {
      if (0 <= x && x < grid.length && 0 <= y && y < grid[x].length) {
        return grid[x][y];
      }

      return false;
    },

    // count how many live neighbors a cell has
    sum_neighbors: function (grid, x, y) {
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

        if (ConwayUtils.is_alive(grid, neighbor_x, neighbor_y)) {
          sum++;
        }
      });

      return sum;
    },

    // get the next state of a cell
    get_new_state: function (grid, x, y) {
      var sum = ConwayUtils.sum_neighbors(grid, x, y),
        alive = ConwayUtils.is_alive(grid, x, y);

      if (alive && (sum < 2 || 3 < sum)) {
        // dies
        return false;
      }

      if ((!alive) && sum === 3) {
        // is born
        return true;
      }

      // no change
      return alive;
    },

    // run a step of conway's game of life, and return the new state
    step_conway: function (grid) {
      return grid.map(function (row, x) {
        return row.map(function (cell, y) {
          return ConwayUtils.get_new_state(grid, x, y);
        });
      });
    },


    ///////////////////// Parsing URL options

    // parses starting grid in the form 1101,1011,0011,0101 where each row is 1s and 0s, rows separated by commas
    parse_starting_grid: function (url_string) {
      return url_string.split(",").map(function (row) {
        return row.split("").map(function (cell) {
          // cell becomes true if it's a 1, false otherwise
          return cell === "1";
        });
      });
    },


    ///////////////////// Putting it all together


    run_game: function (element) {
      var dimensions,
        pad = Pad(element),
        cell_width,
        cell_height,
        curr_grid,

        // default options
        options = {
          grid: "0010,1001,1001,0100",
          size_x: 10,
          size_y: 10,
          interval: 1000
        };

      $.extend(options, ConwayOptions.parse_URL_hash());

      // set starting state
      curr_grid = ConwayUtils.parse_starting_grid(options.grid);

      // number of cells to draw
      dimensions = {
        x: options.size_x,
        y: options.size_y
      };

      // calculate size of each cell based on number of cells and canvas size
      cell_width = pad.get_width() / dimensions.x;
      cell_height = pad.get_height() / dimensions.y;

      // initial render
      ConwayUtils.draw_cells(pad, curr_grid, cell_width, cell_height);

      setInterval(function () {
        curr_grid = ConwayUtils.step_conway(curr_grid);
        ConwayUtils.draw_cells(pad, curr_grid, cell_width, cell_height);
      }, options.interval);

      setInterval(ConwayOptions.check_hash, 50);
    }
  };

  window.ConwayUtils = ConwayUtils;
}());
