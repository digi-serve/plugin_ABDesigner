import definitions from "./src/definitions.js";
import ApplicationFactory from "./src/application.js";
import Labels from "./src/labels/labels.js";

import designerCSS from "./styles/Designer.css";

if (window.__ABBS) {
   window.__ABBS.addPlugin({
      version: "0.0.0",
      key: "ABDesigner",
      apply: function (AB) {
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
      definitions: function () {
         return definitions;
      },
      labels: function (lang) {
         return Labels[lang] || Labels.en;
      },
   });
}
