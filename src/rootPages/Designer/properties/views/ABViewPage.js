/*
 * ABViewPage
 * A Property manager for our ABViewPage definitions
 */

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   const ABViewContainer = FABViewContainer(AB);
   // const L = ABViewClassProperty.L();

   class ABViewPageProperty extends ABViewContainer {
      constructor() {
         super("properties_abview_page", {
            // Put our ids here
         });
      }

      static get key() {
         return "page";
      }

      ui() {
         return super.ui([]);
      }

      async init(AB) {
         return super.init(AB);
      }

      populate(view) {
         super.populate(view);
      }

      /*
defaultValues() {
   var values = {
      dataviewID: null,
      buttonLabel: "Upload CSV",
      width: 0,
      recordRules: [],
   };

   var FieldClass = this.ViewClass();
   if (FieldClass) {
      var fcValues = FieldClass.defaultValues();
      Object.keys(fcValues).forEach((k) => {
         values[k] = fcValues[k];
      });
   }

   return values;
}
*/

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         let vals = super.values();

         return vals;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("page");
      }
      /*
toSettings() {
   var base = this.defaults();
   base.settings = this.defaultValues();
   return base;
}
*/
   }

   return ABViewPageProperty;
}
