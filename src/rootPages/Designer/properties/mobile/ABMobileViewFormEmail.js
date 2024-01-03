/*
 * ABFieldEmail
 * A Property manager for our ABFieldEmail.
 */

import FABMobileViewFormItem from "./ABMobileViewFormItem";

export default function (AB) {
   const ABMobileViewFormItem = FABMobileViewFormItem(AB);
   const L = ABMobileViewFormItem.L();
   const uiConfig = AB.Config.uiSettings();

   class ABMobileViewFormEmail extends ABMobileViewFormItem {
      constructor() {
         super("properties_abmobileview_form_email", {
            default: "",
            defaultCheckbox: "",
         });
      }

      static get key() {
         return "mobile-email";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Value:"),
                     align: "right",
                     width: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv);
                           this.onChange();
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     id: ids.default,
                     name: "default",
                     placeholder: L("Enter default value"),
                     disabled: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     on: {
                        onChange: (/* newv */) => {
                           this.isValid();
                           this.onChange();
                        },
                        onAfterRender() {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
         ]);
      }

      checkboxDefaultValue(state) {
         if (state === 0) {
            $$(this.ids.default).disable();
            $$(this.ids.default).setValue("");
         } else {
            $$(this.ids.default).enable();
         }
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      // ViewClass() {
      //    debugger;
      //    return super._ViewClass(ABMobileViewFormEmail.key);
      // }

      isValid() {
         const ids = this.ids;
         let isValid = super.isValid();

         $$(ids.component).clearValidation();

         if (isValid) {
            const isRequired = $$(ids.required).getValue();
            const emailDefault = $$(ids.default).getValue();

            if (isRequired || emailDefault) {
               if (!webix.rules.isEmail(emailDefault)) {
                  $$(ids.component).markInvalid(
                     "default",
                     L("This email is invalid")
                  );
                  isValid = false;
               } else isValid = true;
            } else isValid = true;
         }

         return isValid;
      }

      populate(view) {
         const ids = this.ids;
         super.populate(view);

         let DV = this.defaultValues();

         Object.keys(ids).forEach((k) => {
            let $ui = $$(ids[k]);
            if ($ui) {
               let s = view.settings[k] ?? DV[k];
               if (typeof s != "undefined") {
                  $ui.setValue?.(s);
               }
            }
         });

         // IF required is true, then we force defaultCheckbox to 1
         //
         if (view.settings.default === "") {
            $$(ids.defaultCheckbox).setValue(0);
         } else {
            $$(ids.defaultCheckbox).setValue(1);
         }

         this.isValid();
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

   return ABMobileViewFormEmail;
}
