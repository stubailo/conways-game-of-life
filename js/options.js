/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */

(function () {
  "use strict";

  if(window.Conway === undefined) {
    window.Conway = {};
  }

  $.extend(window.Conway, {
    OptionsModel: Backbone.Model.extend({
      defaults: {
        "cell-size": 10,
        "update-interval": 1000,
        "grid-size-x": 10,
        "grid-size-y": 10,
        "drawer-open": false
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
        "submit":    "update_model",
        "click .title": "toggle_open"
      },

      update_model: function (event) {
        var val_array = this.$("form").serializeArray(),
          attributes = {};

        // serialize form into attributes (all of them are integers)
        val_array.forEach(function (name_val_pair) {
          attributes[name_val_pair["name"]] = parseInt(name_val_pair["value"]);
        });
        
        console.log(attributes);

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

  var ConwayOptions = {
    // parses URL-encoded options (key=val&key2=val2) in the hash, returns dictionary of option names to values
    parse_hash: function (hash_text) {
      var options = {},
        pairs,
        split;

      pairs = hash_text.split("&");

      pairs.forEach(function (pair) {
        if (pair.length > 0) {
          split = pair.split("=");
          if (split.length === 2) {
            options[split[0]] = split[1];
          }
        }
      });
      return options;
    },

    parse_URL_hash: function () {
      var hash_text = window.location.hash;

      if (hash_text.length > 1) {
        return ConwayOptions.parse_hash(hash_text.slice(1));
      }

      return {};
    },

    // merges a dictionary with a second one, with the second taking precedence
    merge_options: function (first, override) {
      var key;

      for (key in override) {
        if (override.hasOwnProperty(key)) {
          first[key] = override[key];
        }
      }
    },

    // see if hash has changed; if so then refresh page.  Comes with a singleton to keep track of previous hash
    prev_hash: window.location.hash,

    check_hash: function () {
      if (window.location.hash !== ConwayOptions.prev_hash) {
        window.location.reload();
      }
    }
  };

  window.ConwayOptions = ConwayOptions;
}());
