/*
 * ABMobileViewFormFile
 * A Property manager for our ABMobileViewFormCustom definitions
 */

import FABMobileViewFormCustom from "./ABMobileViewFormCustom";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_file";

   const ABMobileViewFormCustom = FABMobileViewFormCustom(AB);

   class ABMobileViewFormFileProperty extends ABMobileViewFormCustom {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-file";
      }
   }

   return ABMobileViewFormFileProperty;
}
