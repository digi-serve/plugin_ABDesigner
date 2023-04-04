/**
 * ABViewDetailCheckbox
 * A Property manager for our ABViewDetailCheckbox definitions
 */

import FABViewDetailItem from "./ABViewDetailItem";

export default function (AB) {
   const BASE_ID = "properties_abview_detail_checkbox";

   const ABViewDetailItem = FABViewDetailItem(AB);

   class ABViewDetailCheckboxProperty extends ABViewDetailItem {
      constructor() {
         super(BASE_ID, {
            height: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "detailcheckbox";
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("detailcheckbox");
      }
   }

   return ABViewDetailCheckboxProperty;
}
