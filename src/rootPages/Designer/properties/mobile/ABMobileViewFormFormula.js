/*
 * ABMobileViewFormFile
 * A Property manager for our ABMobileViewFormCustom definitions
 */

import FABMobileViewFormReadonly from "./ABMobileViewFormReadonly";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_formula";

   const ABMobileViewFormReadonly = FABMobileViewFormReadonly(AB);

   class ABMobileViewFormFormulaProperty extends ABMobileViewFormReadonly {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-formula";
      }
   }

   return ABMobileViewFormFormulaProperty;
}
