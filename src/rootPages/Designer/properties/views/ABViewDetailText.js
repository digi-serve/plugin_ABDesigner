/**
 * ABViewDetailText
 * A Property manager for our ABViewDetailText definitions
 */

import FABViewDetailItem from "./ABViewDetailItem";

export default function (AB) {
   const BASE_ID = "properties_abview_detail_text";
   const DEFAULT_VALUES = {
      height: 0,
   };

   const ABViewDetailItem = FABViewDetailItem(AB);

   class ABViewDetailTextProperty extends ABViewDetailItem {
      constructor() {
         super(BASE_ID, {
            height: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "detailtext";
      }

      ui() {
         return super.ui([
            {
               id: this.ids.height,
               name: "height",
               view: "counter",
               label: this.label("Height"),
               on: {
                  onChange: () => this.onChange(),
               },
            },
         ]);
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("detailtext");
      }

      populate(view) {
         super.populate(view);
         const defaults = this.defaultValues();
         const height = view.settings?.height ?? defaults.height;
         $$(this.ids.height).setValue(height);
      }

      defaultValues() {
         const values = super.defaultValues();
         return Object.assign(DEFAULT_VALUES, values);
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values() ?? {};
         values.settings = values.settings ?? {};
         values.settings.height = $$(this.ids.height).getValue();
         return values;
      }
   }

   return ABViewDetailTextProperty;
}
