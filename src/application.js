import DesignerFactory from "./rootPages/Designer/ui.js";

export default function (AB) {
   var Designer = DesignerFactory(AB);

   var application = {
      id: "ABDesigner",
      label: "AB Designer", // How to get Multilingual?
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
   return application;
}
