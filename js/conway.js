/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global $: false, Backbone: false, Conway: false, ConwayUtils: false, ConwayOptions: false, Color: false, Coord: false, Pad: false */

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
      var grid = "0010,1001,1001,0100";

      // set starting state
      this.set("grid", ConwayUtils.parse_starting_grid(grid));
      this.listenTo(this.get("options"), "change:update-interval", this.restart_game);

      this.set("turns", 0);
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
      var pad = Pad(this.$("canvas")[0]),
        options = this.model.get("options"),
        cell_size = this.$("canvas").height() / options.get("grid-size");

      // initial render
      ConwayUtils.draw_cells(pad, this.model.get("grid"), cell_size, cell_size);
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
      $("canvas").attr("height", square_side).attr("width", square_side);

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
