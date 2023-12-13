/*
 * ABMobileViewFormImage
 * A Property manager for our ABMobileViewFormCustom definitions
 */

import FABMobileViewFormCustom from "./ABMobileViewFormCustom";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_image";

   const ABMobileViewFormCustom = FABMobileViewFormCustom(AB);

   class ABMobileViewFormImageProperty extends ABMobileViewFormCustom {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "mobile-image";
      }
   }

   return ABMobileViewFormImageProperty;
}
