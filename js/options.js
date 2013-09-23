/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */

(function () {
  "use strict";

  if(window.Conway === undefined) {
    window.Conway = {};
  }

  $.extend(window.Conway, {
    OptionsModel: Backbone.Model.extend({
      defaults: {
        "update-interval": 1000,
        "grid-size": 10,
        "drawer-open": true
      }
    }),

    OptionsView: Backbone.View.extend({

      initialize: function () {
        console.log(this.el);
        this.animation_duration = 0;
        this.render();
        this.animation_duration = 400;

        this.listenTo(this.model, "change", this.render);
      },

      events: {
        "submit":         "update_model",
        // "change input":   "update_model", // uncomment to make the submit button unnecessary
        "click .title":   "toggle_open"
      },

      update_model: function (event) {
        var val_array = this.$("form").serializeArray(),
          attributes = {};

        // serialize form into attributes (all of them are integers)
        val_array.forEach(function (name_val_pair) {
          attributes[name_val_pair["name"]] = parseInt(name_val_pair["value"]);
        });
        
        this.model.set(attributes);
        return false;
      },
      
      toggle_open: function (event) {
        // set the drawer open attribute to the opposite of the prev. state
        this.model.set("drawer-open", !this.model.get("drawer-open"));
      },

      render: function () {
        var _this = this;

        _.pairs(this.model.attributes).forEach(function (pair) {
          _this.$("form #" + pair[0]).val(pair[1]);
        });

        if (this.model.get("drawer-open")) {
          this.$(".title .glyphicon").removeClass("glyphicon-chevron-right");
          this.$(".title .glyphicon").addClass("glyphicon-chevron-down");
          this.$("form").slideDown(this.animation_duration);
        } else {
          this.$(".title .glyphicon").addClass("glyphicon-chevron-right");
          this.$(".title .glyphicon").removeClass("glyphicon-chevron-down");
          this.$("form").slideUp(this.animation_duration);
        }
      }
    })
  });
}());
