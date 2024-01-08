/*
 * ABViewFormSelectMultiple
 * A Property manager for our ABViewFormSelectMultiple definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_select_multiple";

   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();

   class ABMobileViewFormSelectMultipleProperty extends ABMobileViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            type: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "mobile-selectmultiple";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.type,
               name: "type",
               view: "richselect",
               label: L("Type"),
               options: [
                  {
                     id: "multicombo",
                     value: L("Multi Combo"),
                  },
                  {
                     id: "checkbox",
                     value: L("Checkboxes"),
                  },
               ],
               on: {
                  onChange: () => this.onChange(),
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const DV = this.defaultValues();

         $$(ids.type).setValue(view.settings.type || DV.type);
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;

         const $component = $$(ids.component);

         const values = super.values() ?? {};
         values.settings = $component.getValues() ?? {};
         values.settings.type = $$(ids.type).getValue();

         return values;
      }
   }

   return ABMobileViewFormSelectMultipleProperty;
}
