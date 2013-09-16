/*jslint es5: true, browser: true, indent: 2, newcap: true, plusplus: true */

(function () {
  "use strict";

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
