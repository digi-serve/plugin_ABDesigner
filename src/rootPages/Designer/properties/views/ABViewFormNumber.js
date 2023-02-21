/*
 * ABViewFormNumber
 * A Property manager for our ABViewFormNumber definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_number";

   const ABViewFormItem = FABViewFormItem(AB);
   const L = ABViewFormItem.L();

   class ABViewFormNumberProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            isStepper: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "numberbox";
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
         const ABViewFormNumberPropertyComponentDefaults = this.defaultValues();

         $$(ids.isStepper).setValue(
            view.settings.isStepper != null
               ? view.settings.isStepper
               : ABViewFormNumberPropertyComponentDefaults.isStepper
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

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("numberbox");
      }
   }

   return ABViewFormNumberProperty;
}
