/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */
/*global Conway: false, _: false, Backbone: false, $: false */

(function () {
  "use strict";

  if(window.Conway === undefined) {
    window.Conway = {};
  }

  $.extend(window.Conway, {

    // Model for options panel, basically just has attributes
    OptionsModel: Backbone.Model.extend({
      defaults: {
        "update-interval": 1000,
        "grid-size": 10,
        "drawer-open": false
      }
    }),

    // View for options panel
    OptionsView: Backbone.View.extend({

      initialize: function () {
        this.render();

        this.listenTo(this.model, "change", this.render);
      },

      events: {
        "submit":         "update_model",
        // "change input":   "update_model", // uncomment to make the submit button unnecessary
      },

      update_model: function (event) {
        var val_array = this.$("form").serializeArray(),
          attributes = {};

        // serialize form into attributes (all of them are integers)
        val_array.forEach(function (name_val_pair) {
          attributes[name_val_pair.name] = parseInt(name_val_pair.value, 10);
        });
        
        this.model.set(attributes);
        return false;
      },

      render: function () {
        var _this = this;

        _.pairs(this.model.attributes).forEach(function (pair) {
          _this.$("form #" + pair[0]).val(pair[1]);
        });
      }
    })
  });
}());
