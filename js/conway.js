/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global $: false, Backbone: false, Conway: false, ConwayUtils: false, ConwayOptions: false, d3: false*/

(function () {
  "use strict";

  // model for the game, keeps track of grid and playback status
  var ConwayModel = Backbone.Model.extend({
    defaults: function () {
      return {
        options: new Conway.OptionsModel(),
        paused: true,
        turns: 0
      };
    },

    initialize: function () {
      // create new empty grid of appropriate size
      this.resize_grid();

      this.listenTo(this.get("options"), "change:update-interval", this.restart_game);
      this.listenTo(this.get("options"), "change:grid-size", this.resize_grid);
    },

    // set a new size for the grid, copying any previous living cells to the new grid if they fit
    resize_grid: function () {
      var new_grid_size = this.get("options").get("grid-size"),
        new_grid = [],
        new_row,
        new_cell,
        x,
        y;

      // not using forEach because the new grid doesn't exist yet to iterate over
      for (x = 0; x < new_grid_size; x++) {
        new_row = [];
        for (y = 0; y < new_grid_size; y++) {
          // initialize to dead cell
          new_cell = false;
          
          // see if there is an old value to be copied
          if (this.get("grid") !== undefined) {
            // if so, copy it
            // this function is guaranteed to not give an index error
            new_cell = ConwayUtils.is_alive(this.get("grid"), x, y);
          }

          // add cell to the row being built
          new_row.push(new_cell);
        }

        // add row that was just built
        new_grid.push(new_row);
      }

      // update to new grid
      this.set("grid", new_grid);
    },

    // set an interval to call step_game
    start_game: function () {
      this.interval = setInterval(
        $.proxy(this.step_game, this),
        this.get("options").get("update-interval")
      );
      this.set("paused", false);
    },

    // one step of the game
    step_game: function () {
      this.set("grid", ConwayUtils.step_conway(this.get("grid")));
      this.set("turns", this.get("turns") + 1);
    },

    // clear the interval calling the grid update
    pause_game: function () {
      clearInterval(this.interval);
      this.set("paused", true);
    },

    // pause and start the game so that the interval can update
    restart_game: function () {
      this.pause_game();
      this.start_game();
    },

    // set grid to empty, stop playback, set turn counter to 0
    clear_board: function () {
      this.pause_game();
      this.set("grid", undefined);
      this.set("turns", 0);
      this.resize_grid();
    }
  });

  // view for the game controls
  // all of the function names are pretty self-explanatory
  var ConwayToolsView = Backbone.View.extend({
    initialize: function () {
      this.render();

      this.listenTo(this.model, "change", this.render);
    },

    events: {
      "click .play": "toggle_pause",
      "click .pause": "toggle_pause",
      "click .clear": "clear_board"
    },

    render: function () {
      this.$(".counter").text(this.model.get("turns"));

      if (this.model.get("paused")) {
        this.$(".play").show();
        this.$(".pause").hide();
      } else {
        this.$(".play").hide();
        this.$(".pause").show();
      }
    },
    
    toggle_pause: function () {
      if (this.model.get("paused")) {
        this.model.start_game();
      } else {
        this.model.pause_game();
      }
    },

    clear_board: function () {
      this.model.clear_board();
    },
  });

  // view for the grid display
  var ConwayGridView = Backbone.View.extend({
    initialize: function () {
      // keep track of mouse being down or up
      this.mouse_down = false;

      this.$canvas = this.$("#canvas");
      this.canvas = this.$canvas[0];
      this.render();

      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model.get("options"), "change", this.render);

      // resize #canvas to fill the available room
      this.fill_space();

      // fill available room whenever browser is resized
      $(window).on("resize", $.proxy(this.fill_space, this));
    },

    render: function () {
      var options = this.model.get("options"),
        cell_size = this.$("#canvas").height() / options.get("grid-size"),
        _this = this;
      
      // clear 
      this.$canvas.html("");

      // function to set attributes on new cell
      function add_cell(is_alive, x, y) {
        // create new cell and get reference
        var new_cell = $("<div>").appendTo(_this.$canvas);

        // set size programmatically
        new_cell.css({
          height: cell_size - 2,
          width: cell_size - 2
        });

        // set classes
        new_cell.addClass("cell");
        if (is_alive) {
          new_cell.addClass("cell-alive");
        } else {
          new_cell.addClass("cell-dead");
        }

        // function that can set this cell to be alive
        function come_alive() {
          // set value in model
          _this.model.get("grid")[x][y] = true;

          // but update just this cell in the view
          new_cell.addClass("cell-alive");
          new_cell.removeClass("cell-dead");
          is_alive = true;
        }
        
        // function that can set this cell to be dead
        function kill() {
          _this.model.get("grid")[x][y] = false;
          new_cell.removeClass("cell-alive");
          new_cell.addClass("cell-dead");
          is_alive = false;
        }

        // switch from dead to alive and back
        function toggle() {
          if (is_alive) {
            kill();
          } else {
            come_alive();
          }
        }

        // if you drag your mouse, change state
        new_cell.on("mouseover", function (event) {
          if (_this.mouse_down) {
            toggle();
          }
        });

        // start dragging, toggle this cell's state
        new_cell.on("mousedown", function (event) {
          _this.mouse_down = true;
          $(window).one("mouseup", function () {
            _this.mouse_down = false;
          });
          toggle();
        });
      }

      // iterate over grid and add cells
      if (this.model.get("grid")) {
        this.model.get("grid").forEach(function (row, x) {
          row.forEach(function (cell, y) {
            add_cell(cell, x, y);
          });
        });
      }
    },

    // measure available space, resize to fill it
    fill_space: function () {
      var max_width = this.$el.width();
      var max_height = $(window).height() - this.$(".tools").height() - 30;

      var square_side = Math.min(max_width, max_height);
      this.$canvas.css({
        height: square_side,
        width: square_side
      });

      this.render();
    }
  });

  if(window.Conway === undefined) {
    window.Conway = {};
  }

  // put the classes into the Conway module
  $.extend(window.Conway, {
    ConwayModel: ConwayModel,
    ConwayGridView: ConwayGridView,
    ConwayToolsView: ConwayToolsView
  });
}());
