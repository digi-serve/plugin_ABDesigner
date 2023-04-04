/**
 * ABViewDetailCustom
 * A Property manager for our ABViewDetailCustom definitions
 */

import FABViewDetailItem from "./ABViewDetailItem";

export default function (AB) {
   const BASE_ID = "properties_abview_detail_custom";

   const ABViewDetailItem = FABViewDetailItem(AB);

   class ABViewDetailCustomProperty extends ABViewDetailItem {
      constructor() {
         super(BASE_ID, {
            height: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "detailcustom";
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("detailcustom");
      }
   }

   return ABViewDetailCustomProperty;
}
