/*
 * ABViewFormItem
 * A Property manager for our ABViewFormItem definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const L = ABView.L();
   const DEFAULT_VALUES = {
      required: 0,
      disable: 0,
   };

   class ABViewFormItemProperty extends ABView {
      constructor(BASE_ID, ids = {}) {
         super(
            BASE_ID,
            Object.assign(ids, {
               // Put our ids here
               field: "",
               required: "",
               disable: "",
            })
         );

         this.AB = AB;
      }

      ui(elements = [], rules = {}) {
         const ids = this.ids;
         const uiSettings = this.AB.UISettings.config();
         const _ui = [
            {
               id: ids.field,
               name: "fieldLabel",
               view: "text",
               disabled: true,
               label: L("Field"),
            },
            {
               id: ids.required,
               name: "required",
               view: "checkbox",
               labelWidth: uiSettings.labelWidthCheckbox,
               labelRight: L("Required"),
               click: () => this.onChange(),
            },
            {
               id: ids.disable,
               name: "disable",
               view: "checkbox",
               labelWidth: uiSettings.labelWidthCheckbox,
               labelRight: L("Disable"),
               click: () => this.onChange(),
            },
         ].concat(elements);

         return super.ui(_ui, rules);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const ABViewFormItemPropertyDefaults = this.defaultValues();
         const field = view.field();

         $$(ids.field).setValue(field ? field.label : "");

         if (field?.settings?.required == 1) {
            $$(ids.required).setValue(field.settings.required);
            $$(ids.required).disable();
         } else {
            $$(ids.required).setValue(
               view.settings?.required != null
                  ? view.settings.required
                  : ABViewFormItemPropertyDefaults.required
            );
         }

         if (view.settings?.disable == 1) {
            $$(ids.disable).setValue(view.settings.disable);
         } else {
            $$(ids.disable).setValue(ABViewFormItemPropertyDefaults.disable);
         }
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = {};

         if (ViewClass) {
            values = ViewClass.defaultValues();
         }

         return Object.assign(DEFAULT_VALUES, values);
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const ids = this.ids;

         const values = super.values() ?? {};
         values.settings = values.settings ?? {};
         values.settings.required = $$(ids.required).getValue();
         values.settings.disable = $$(ids.disable).getValue();

         return values;
      }
   }

   return ABViewFormItemProperty;
}
