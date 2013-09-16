/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global ConwayOptions: false, Color: false, Coord: false, Pad: false */

(function () {
  "use strict";

  var Conway = {

    //////////////////// Rendering

    // draw a grid of cells on the pad - black rectangle for true, white for false
    draw_cells: function (pad, grid, cell_width, cell_height) {
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

        if (Conway.is_alive(grid, neighbor_x, neighbor_y)) {
          sum++;
        }
      });

      return sum;
    },

    // get the next state of a cell
    get_new_state: function (grid, x, y) {
      var sum = Conway.sum_neighbors(grid, x, y),
        alive = Conway.is_alive(grid, x, y);

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
      var x,
        y,
        output_grid = [],
        new_row;

      for (x = 0; x < grid.length; x++) {
        new_row = [];
        output_grid.push(new_row);

        for (y = 0; y < grid[x].length; y++) {
          new_row.push(Conway.get_new_state(grid, x, y));
        }
      }

      return output_grid;
    },


    ///////////////////// Parsing URL options

    // parses starting grid in the form 1101,1011,0011,0101 where each row is 1s and 0s, rows separated by commas
    parse_starting_grid: function (url_string) {
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
    },


    ///////////////////// Putting it all together

    run_game: function (element) {
      var dimensions,
        pad = Pad(element),
        cell_width,
        cell_height,
        curr_grid,
        options = {
          grid: "0010,1001,1001,0100",
          size_x: 10,
          size_y: 10,
          interval: 1000
        };

      ConwayOptions.merge_options(options, ConwayOptions.parse_URL_hash());

      // set starting state
      curr_grid = Conway.parse_starting_grid(options.grid);

      // number of cells to draw
      dimensions = {
        x: options.size_x,
        y: options.size_y
      };

      // calculate size of each cell based on number of cells and canvas size
      cell_width = pad.get_width() / dimensions.x;
      cell_height = pad.get_height() / dimensions.y;

      // initial render
      Conway.draw_cells(pad, curr_grid, cell_width, cell_height);

      setInterval(function () {
        curr_grid = Conway.step_conway(curr_grid);
        Conway.draw_cells(pad, curr_grid, cell_width, cell_height);
      }, options.interval);

      setInterval(ConwayOptions.check_hash, 50);
    }
  };

  window.Conway = Conway;
}());
