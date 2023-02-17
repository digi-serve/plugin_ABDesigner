/*
 * ABViewFormTree
 * A Property manager for our ABViewFormTree definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_tree";

   const ABViewFormItem = FABViewFormItem(AB);

   class ABViewFormTreeProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "formtree";
      }
   }

   return ABViewFormTreeProperty;
}
