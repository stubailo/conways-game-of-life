/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global $: false, Backbone: false, Conway: false, ConwayUtils: false, ConwayOptions: false, d3: false*/

(function () {
  "use strict";

  var ConwayModel = Backbone.Model.extend({
    defaults: function () {
      return {
        options: new Conway.OptionsModel(),
        paused: true
      };
    },

    initialize: function () {
      // set starting state
      this.resize_grid();

      this.listenTo(this.get("options"), "change:update-interval", this.restart_game);
      this.listenTo(this.get("options"), "change:grid-size", this.resize_grid);

      this.set("turns", 0);
    },

    resize_grid: function () {
      var new_grid_size = this.get("options").get("grid-size"),
        new_grid = [],
        new_row,
        new_cell,
        x,
        y;

      for (x = 0; x < new_grid_size; x++) {
        new_row = [];
        for (y = 0; y < new_grid_size; y++) {
          new_cell = false;
          
          // see if there is an old value to be copied
          if (this.get("grid") !== undefined) {
            // this function is guaranteed to not give an index error
            new_cell = ConwayUtils.is_alive(this.get("grid"), x, y);
          }

          new_row.push(new_cell);
        }
        new_grid.push(new_row);
      }

      this.set("grid", new_grid);
    },

    start_game: function () {
      this.interval = setInterval(
        $.proxy(this.step_game, this),
        this.get("options").get("update-interval")
      );
      this.set("paused", false);
    },

    step_game: function () {
      this.set("grid", ConwayUtils.step_conway(this.get("grid")));
      this.set("turns", this.get("turns") + 1);
    },

    pause_game: function () {
      clearInterval(this.interval);
      this.set("paused", true);
    },

    restart_game: function () {
      this.pause_game();
      this.start_game();
    }
  });

  var ConwayView = Backbone.View.extend({
    initialize: function () {
      this.$canvas = this.$("#canvas");
      this.canvas = this.$canvas[0];
      this.render();

      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model.get("options"), "change", this.render);

      this.fill_space();
      $(window).on("resize", $.proxy(this.fill_space, this));
    },

    events: {
      "click .play": "toggle_pause",
      "click .pause": "toggle_pause"
    },

    render_grid: function () {
      var options = this.model.get("options"),
        cell_size = this.$("#canvas").height() / options.get("grid-size"),
        _this = this;
      
      // clear
      
      this.$canvas.html("");

      this.model.get("grid").forEach(function (row, x) {
        row.forEach(function (cell, y) {
          (function () {
            var new_cell = $("<div>").appendTo(_this.$canvas);

            new_cell.css({
              height: cell_size - 2,
              width: cell_size - 2
            });

            new_cell.addClass("cell");

            if (cell) {
              new_cell.addClass("cell-alive");
            } else {
              new_cell.addClass("cell-dead");
            }

            function come_alive() {
              _this.model.get("grid")[x][y] = true;
              new_cell.addClass("cell-alive");
              new_cell.removeClass("cell-dead");
            }

            new_cell.on("mouseover", function (event) {
              if (event.which === 1) {
                come_alive();
              }
            });

            new_cell.on("mousedown", function (event) {
              come_alive();
            });
          }());
        });
      });
    },

    render: function () {
      this.render_grid();

      this.$(".tools .counter").text(this.model.get("turns") + " turns");

      if (this.model.get("paused")) {
        this.$(".tools .play").show();
        this.$(".tools .pause").hide();
      } else {
        this.$(".tools .play").hide();
        this.$(".tools .pause").show();
      }
    },

    toggle_pause: function () {
      if (this.model.get("paused")) {
        this.model.start_game();
      } else {
        this.model.pause_game();
      }
    },

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

  $.extend(window.Conway, {
    ConwayModel: ConwayModel,
    ConwayView: ConwayView
  });
}());
