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
      require("./views/ABViewCarousel"),
      require("./views/ABViewContainer"),
      require("./views/ABViewDataview"),
      require("./views/ABViewDetail"),
      require("./views/ABViewDocxBuilder"),
      require("./views/ABViewForm"),
      require("./views/ABViewGrid"),
      require("./views/ABViewPage"),
      require("./views/ABViewTab"),
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
