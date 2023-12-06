/*
 * ABMobileViewFormTextbox
 * A Property manager for our ABViewFormTextbox definitions
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abmobileview_form_textbox";

   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();

   class ABMobileViewFormTextboxProperty extends ABMobileViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            type: "",
            placeholder: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "mobile-textbox";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.type,
               name: "type",
               view: "radio",
               label: L("Type"),
               vertical: true,
               options: [
                  {
                     id: "single",
                     value: L("Single line"),
                  },
                  {
                     id: "multiple",
                     value: L("Multiple lines"),
                  },
                  {
                     id: "rich",
                     value: L("Rich editor"),
                  },
               ],
               on: {
                  onChange: () => this.onChange(),
               },
            },
            {
               id: ids.placeholder,
               name: "placeholder",
               view: "text",
               label: L("Placeholder"),
               placeholder: L("Text Placeholder"),
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
         $$(ids.placeholder).setValue(
            view.settings.placeholder || DV.placeholder
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
         // values.settings.type = $$(ids.type).getValue();
         // values.settings.placeholder = $$(ids.placeholder).getValue();

         return values;
      }
   }

   return ABMobileViewFormTextboxProperty;
}
