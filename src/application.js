import DesignerFactory from "./rootPages/Designer/ui.js";
import initCustomWebix from "./webix_custom_components/customComponentManager.js";

export default function (AB) {
   var Designer = DesignerFactory(AB);

   var application = {
      id: "ABDesigner",
      label: "AB Designer", // How to get Multilingual?
      icon: "fa-connectdevelop",
      // {string} the AB.Multilingual.Label(Key)
      isPlugin: true,

      pages: function () {
         // Return the Root Pages required to
         return this._pages;
      },
      _pages: [Designer],
      // init: function (AB) {
      //    debugger;
      //    this._pages.forEach((p) => {
      //       p.init(AB);
      //    });
      // },
      datacollectionsIncluded: () => {
         // return [];
         var myDCs = [];
         return AB.datacollections((d) => myDCs.indexOf(d.id) > -1);
      },
   };
   Designer.application = application;
   initCustomWebix(AB);
   return application;
}
