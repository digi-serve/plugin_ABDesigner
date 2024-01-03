/*
 * ABMobileViewFormReadonly
 * A Property manager for our ABMobileViewFormReadonly definitions
 */

import FABMobileViewFormCustom from "./ABMobileViewFormCustom";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_readonly";

   const ABMobileViewFormCustom = FABMobileViewFormCustom(AB);

   class ABMobileViewFormReadonlyProperty extends ABMobileViewFormCustom {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-fieldreadonly";
      }

      ui() {
         // we want to NOT display the above parent fields:
         this.fieldsHide.required = 1;
         this.fieldsHide.disable = 1;

         return super.ui([]);
      }
   }

   return ABMobileViewFormReadonlyProperty;
}
