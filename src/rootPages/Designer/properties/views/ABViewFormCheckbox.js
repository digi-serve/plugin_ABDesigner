/*
 * ABViewFormCheckbox
 * A Property manager for our ABViewFormCheckbox definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_checkbox";

   const ABViewFormItem = FABViewFormItem(AB);

   class ABViewFormCheckboxProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "checkbox";
      }
   }

   return ABViewFormCheckboxProperty;
}
