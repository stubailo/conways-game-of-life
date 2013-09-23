/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global chai: false, describe: false, it: false, ConwayUtils: false, Conway: false */

(function() {
  "use strict";

  var assert = chai.assert;
  describe("Conway utilities", function() {
    it("Correctly identifies dead and alive cells", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.isTrue(ConwayUtils.is_alive(grid, 0, 0));
      assert.isFalse(ConwayUtils.is_alive(grid, 0, 1));
    });
    
    it("Correctly identifies cells off the grid as dead", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.isFalse(ConwayUtils.is_alive(grid, 0, -1));
      assert.isFalse(ConwayUtils.is_alive(grid, 6, 0));
    });

    it("Correctly adds up the neighbors of a cell", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.equal(1, ConwayUtils.sum_neighbors(grid, 0, 0));
      assert.equal(2, ConwayUtils.sum_neighbors(grid, 0, 1));
    });
  });

  describe("Conway game logic", function() {
    it("Correctly identifies the next state of a living cell", function() {
      var grid;
      // should die
      grid = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, true, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, false, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, true],
        [false, true, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, true],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      // should remain alive
      grid = [
        [false, false, false],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(true, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, false],
        [false, true, false],
        [false, true, true]
      ];
      assert.equal(true, ConwayUtils.get_new_state(grid, 1, 1));

      // should die
      grid = [
        [false, false, false],
        [false, true, false],
        [false, true, false]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, false, false],
        [false, true, false],
        [false, false, false]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
    });
    
    it("Correctly identifies the next state of a dead cell", function() {
      var grid;
      // should remain dead
      grid = [
        [true, true, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, true, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, false, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, true],
        [false, false, true],
        [true, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, true],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      // should come alive
      grid = [
        [false, false, false],
        [false, false, true],
        [false, true, true]
      ];
      assert.equal(true, ConwayUtils.get_new_state(grid, 1, 1));

      // should remain dead
      grid = [
        [false, false, false],
        [false, false, false],
        [false, true, true]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));

      grid = [
        [false, false, false],
        [false, false, false],
        [false, true, false]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
      
      grid = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];
      assert.equal(false, ConwayUtils.get_new_state(grid, 1, 1));
    });

    it("Should calculate a step of the game of life correctly", function () {
      var grid = [
        [false, true, false],
        [false, true, false],
        [false, true, false]
      ];

      var next_grid = [
        [false, false, false],
        [true, true, true],
        [false, false, false]
      ];

      assert.deepEqual(next_grid, ConwayUtils.step_conway(grid));
    });

    it("Should parse encoded starting states correctly", function () {
      var encoded = "111,000,101";

      var grid = [
        [true, true, true],
        [false, false, false],
        [true, false, true]
      ];

      assert.deepEqual(grid, ConwayUtils.parse_starting_grid(encoded));
    });

    it("Should parse empty starting state correctly", function() {
      var encoded = "";

      var grid = [[]];

      assert.deepEqual(grid, ConwayUtils.parse_starting_grid(encoded));
    });
  });

}());
