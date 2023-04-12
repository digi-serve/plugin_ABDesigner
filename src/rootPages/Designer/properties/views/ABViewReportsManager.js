/*
 * ABViewReportsManager
 * A Property manager for our ABViewReportsManager definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_pivot";

   const ABView = FABView(AB);

   class ABViewPivotProperty extends ABView {
      constructor() {
         super(BASE_ID, {});
      }

      static get key() {
         return "reportsManager";
      }

      ui() {
         return super.ui([]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      // populate(view) {
      //    super.populate(view);

      // }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         // const $component = $$(this.ids.component);

         const values = super.values();

         // values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("pivot");
      }
   }

   return ABViewPivotProperty;
}
