/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global ConwayOptions: false, Color: false, Coord: false, Pad: false */

(function () {
  "use strict";

  var ConwayModel = Backbone.Model.extend({
    defaults: function () {
      options: new Conway.OptionsModel()
    }
  });

  var ConwayView = Backbone.View.extend({
    initialize: function () {
      this.render();
    },

    render: function () {
      ConwayUtils.run_game(this.el);
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
