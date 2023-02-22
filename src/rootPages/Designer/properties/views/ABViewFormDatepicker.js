/*
 * ABViewFormDatepicker
 * A Property manager for our ABViewFormDatepicker definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_datepicker";

   const ABViewFormItem = FABViewFormItem(AB);

   class ABViewFormDatepickerProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {});

         this.AB = AB;
      }

      static get key() {
         return "datepicker";
      }
   }

   return ABViewFormDatepickerProperty;
}
