/*
 * ABMobileViewFormCheckbox
 * A Property manager for our ABViewFormCheckbox definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_checkbox";

   const ABMobileViewFormItem = FABMobileViewFormItem(AB);

   class ABMobileViewFormCheckboxProperty extends ABMobileViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-checkbox";
      }

      ui() {
         // we want to NOT display the above parent fields:
         this.fieldsHide.required = 1;

         return super.ui([]);
      }
   }

   return ABMobileViewFormCheckboxProperty;
}
