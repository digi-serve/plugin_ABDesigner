/*
 * ABMobileViewFormCustom
 * A Property manager for our ABMobileViewFormCustom definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_custom";

   const ABMobileViewFormItem = FABMobileViewFormItem(AB);

   class ABMobileViewFormCustomProperty extends ABMobileViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-fieldcustom";
      }
   }

   return ABMobileViewFormCustomProperty;
}
