(function() {
  "use strict";

  var assert = chai.assert;
  var CO = ConwayOptions;

  describe("Options", function() {
    it("Correctly merges options", function() {
      var options_1 = {
        key1: "val1",
        key2: "val2"
      };

      var options_2 = {
        key1: "val1",
        key2: "different"
      };

      CO.merge_options(options_1, options_2);

      assert.equal(options_1.key1, "val1");
      assert.equal(options_1.key2, "different");
    });

    it("Parses strings into options objects", function() {
      var options_string = "key1=val1&key2=val2";

      var options = CO.parse_hash(options_string);
      assert.deepEqual(options, {
        key1: "val1",
        key2: "val2"
      });
    });
    
    it("Parses empty strings", function() {
      var options_string = "";

      var options = CO.parse_hash(options_string);
      assert.deepEqual(options, {});
    });
    
    it("Parses empty values", function() {
      var options_string = "key1=";

      var options = CO.parse_hash(options_string);
      assert.deepEqual(options, {
        key1: ""
      });
    });
    
    it("Ignores malformed pairs", function() {
      var options_string = "key1=val1&keyASDF";

      var options = CO.parse_hash(options_string);
      assert.deepEqual(options, {
        key1: "val1"
      });
    });
  });

  describe("Conway utilities", function() {
    it("Correctly identifies dead and alive cells", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.isTrue(Conway.is_alive(grid, 0, 0));
      assert.isFalse(Conway.is_alive(grid, 0, 1));
    });
    
    it("Correctly identifies cells off the grid as dead", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.isFalse(Conway.is_alive(grid, 0, -1));
      assert.isFalse(Conway.is_alive(grid, 6, 0));
    });

    it("Correctly adds up the neighbors of a cell", function() {
      var grid = [
        [true, false],
        [false, true]
      ];

      assert.equal(1, Conway.sum_neighbors(grid, 0, 0));
      assert.equal(2, Conway.sum_neighbors(grid, 0, 1));
    });
  });

  describe("Conway game logic", function() {
    it("Correctly identifies the next state of a living cell", function() {
      // should die
      var grid = [
        [true, true, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, true, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, false, true],
        [true, true, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, true],
        [false, true, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, true],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      // should remain alive
      var grid = [
        [false, false, false],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(true, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, false],
        [false, true, false],
        [false, true, true]
      ];
      assert.equal(true, Conway.get_new_state(grid, 1, 1));

      // should die
      var grid = [
        [false, false, false],
        [false, true, false],
        [false, true, false]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, false, false],
        [false, true, false],
        [false, false, false]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
    });
    
    it("Correctly identifies the next state of a dead cell", function() {
      // should remain dead
      var grid = [
        [true, true, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, true, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, false, true],
        [true, false, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, true],
        [false, false, true],
        [true, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, true],
        [false, true, true],
        [false, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      // should come alive
      var grid = [
        [false, false, false],
        [false, false, true],
        [false, true, true]
      ];
      assert.equal(true, Conway.get_new_state(grid, 1, 1));

      // should remain dead
      var grid = [
        [false, false, false],
        [false, false, false],
        [false, true, true]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));

      var grid = [
        [false, false, false],
        [false, false, false],
        [false, true, false]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
      
      var grid = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
      ];
      assert.equal(false, Conway.get_new_state(grid, 1, 1));
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

      assert.deepEqual(next_grid, Conway.step_conway(grid));
    });

    it("Should parse encoded starting states correctly", function () {
      var encoded = "111,000,101";

      var grid = [
        [true, true, true],
        [false, false, false],
        [true, false, true]
      ];

      assert.deepEqual(grid, Conway.parse_starting_grid(encoded));
    });

    it("Should parse empty starting state correctly", function() {
      var encoded = "";

      var grid = [[]];

      assert.deepEqual(grid, Conway.parse_starting_grid(encoded));
    });
  });

})();
