/**
 * @fileoverview This file registers the ABDesigner plugin with the global `__AB_Plugins` array.
 * The plugin includes definitions, labels, scripts, and stylesheets required for the ABDesigner functionality.
 *
 * @module ABDesigner
 */

/**
 * @typedef {Object} Plugin
 * @property {string} version - The version of the plugin.
 * @property {string} key - The unique key identifier for the plugin.
 * @property {function} apply - Function to apply the plugin to the AB instance.
 * @property {function} definitions - Function to return the plugin definitions.
 * @property {function} labels - Function to return the labels for the specified language.
 * @property {function} scripts - Function to return the array of script URLs required by the plugin.
 * @property {function} stylesheets - Function to return the array of stylesheet URLs required by the plugin.
 */

import definitions from "./src/definitions.js";
import ApplicationFactory from "./src/application.js";
import Labels from "./src/labels/labels.js";

// pull in our css we defined for our plugin
// eslint-disable-next-line no-unused-vars
import designerCSS from "./styles/Designer.css";

window.__AB_Plugins = window.__AB_Plugins || [];

window.__AB_Plugins.push({
   version: "0.0.0",
   key: "ABDesigner",

   /**
    * @function apply
    * @description Applies the ABDesigner plugin to the AB instance.
    * @param {Object} AB - The AB instance.
    */
   apply: function (AB) {
      // load any custom js or css
      AB.scriptLoadAll(this.scripts());
      AB.cssLoadAll(this.stylesheets());

      // At this point, the Plugin should already have loaded all it's definitions
      // into the AB Factory
      AB.pluginLoad(ApplicationFactory(AB));

      // var labels = Labels.en; /* default */;
      // var lang =AB.Multilingual.currentLanguage();

      // if (Labels[lang]) {
      //    labels = Labels[lang];
      // }
      // AB.pluginLabelLoad("ABDesigner", labels);
   },

   /**
    * @function definitions
    * @description Returns the definitions required by the ABDesigner plugin.
    * @returns {Object} The definitions object.
    */
   definitions: function () {
      return definitions;
   },

   /**
    * @function labels
    * @description Returns the labels for the specified language.
    * @param {string} lang - The language code.
    * @returns {Object} The labels object for the specified language.
    */
   labels: function (lang) {
      return Labels[lang] || Labels.en;
   },

   /**
    * @function scripts
    * @description Returns the array of script URLs required by the ABDesigner plugin.
    * these are required by any 3rd party libraries or other scripts that the plugin needs to run.
    * @returns {string[]} The array of script URLs.
    */
   scripts: function () {
      return [
         // "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js",
         // "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/javascript/javascript.min.js",
      ];
   },

   /**
    * @function stylesheets
    * @description Returns the array of stylesheet URLs required by the ABDesigner plugin.
    * these are required by any 3rd party libraries or other stylesheets that the plugin needs to run.
    * @returns {string[]} The array of stylesheet URLs.
    */
   stylesheets: function () {
      return [
         // "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css",
         // "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/material.min.css",
      ];
   },
});
