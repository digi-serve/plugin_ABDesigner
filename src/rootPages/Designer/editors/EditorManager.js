/*
 * EditorManager
 *
 * An Interface for managing all the various Component Editors we support.
 *
 */
export default function (AB) {
   const Editors = [];
   // {array}
   // All the ABField Component Inerfaces available.
   [
      require("./views/_ABViewDefault"),
      require("./views/ABViewCarousel"),
      require("./views/ABViewChart"),
      require("./views/ABViewChartArea"),
      require("./views/ABViewChartBar"),
      require("./views/ABViewChartLine"),
      require("./views/ABViewChartPie"),
      require("./views/ABViewComment"),
      require("./views/ABViewConditionalContainer"),
      require("./views/ABViewContainer"),
      require("./views/ABViewCSVExporter"),
      require("./views/ABViewCSVImporter"),
      require("./views/ABViewDataSelect"),
      require("./views/ABViewDataview"),
      require("./views/ABViewDetail"),
      require("./views/ABViewDocxBuilder"),
      require("./views/ABViewForm"),
      require("./views/ABViewGantt"),
      require("./views/ABViewGrid"),
      require("./views/ABViewKanban"),
      require("./views/ABViewLabel"),
      require("./views/ABViewLayout"),
      require("./views/ABViewMenu"),
      require("./views/ABViewOrgChart"),
      require("./views/ABViewPage"),
      require("./views/ABViewPDFImporter"),
      require("./views/ABViewPivot"),
      require("./views/ABViewTab"),
      require("./views/ABViewText"),
   ].forEach((E) => {
      const Klass = E.default(AB);

      Editors.push(Klass);
   });

   return {
      /*
       * @function editors
       * return all the currently defined Editors in an array.
       * @param {fn} f
       *        A filter for limiting which editor you want.
       * @return [{ClassUI(Editor1)}, {ClassUI(Editor2)}, ...]
       */
      editors: function (f = () => true) {
         return Editors.filter(f);
      },
   };
}
