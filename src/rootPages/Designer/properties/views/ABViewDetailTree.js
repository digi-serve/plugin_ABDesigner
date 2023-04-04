/**
 * ABViewDetailTree
 * A Property manager for our ABViewDetailTree definitions
 */

import FABViewDetailItem from "./ABViewDetailItem";

export default function (AB) {
   const BASE_ID = "properties_abview_detail_tree";

   const ABViewDetailItem = FABViewDetailItem(AB);

   class ABViewDetailTreeProperty extends ABViewDetailItem {
      constructor() {
         super(BASE_ID, {
            height: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "detailtree";
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("detailtree");
      }
   }

   return ABViewDetailTreeProperty;
}
