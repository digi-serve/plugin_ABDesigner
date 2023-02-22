/*
 * ABViewFormCustom
 * A Property manager for our ABViewFormCustom definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_custom";

   const ABViewFormItem = FABViewFormItem(AB);

   class ABViewFormCustomProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "fieldcustom";
      }
   }

   return ABViewFormCustomProperty;
}
