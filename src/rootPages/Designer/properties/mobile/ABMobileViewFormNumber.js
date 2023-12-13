/*
 * ABMobileViewFormNumber
 * A Property manager for our ABViewFormNumber definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_number";

   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();

   class ABMobileViewFormNumberProperty extends ABMobileViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            isStepper: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "mobile-numberbox";
      }

      ui() {
         const ids = this.ids;
         const uiConfig = this.AB.UISettings.config();

         return super.ui([
            {
               id: ids.isStepper,
               name: "isStepper",
               view: "checkbox",
               labelWidth: uiConfig.labelWidthCheckbox,
               labelRight: L("Plus/Minus Buttons"),
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

         $$(ids.isStepper).setValue(
            view.settings.isStepper != null
               ? view.settings.isStepper
               : DV.isStepper
         );
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
         values.settings.isStepper = $$(ids.isStepper).getValue();

         return values;
      }
   }

   return ABMobileViewFormNumberProperty;
}
