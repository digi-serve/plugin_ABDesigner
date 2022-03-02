/*
 * ABFieldEmail
 * A Property manager for our ABFieldEmail.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldEmail extends ABField {
      constructor() {
         super("properties_abfield_email", {
            default: "",
            defaultCheckbox: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default Value:") + " ",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv);
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
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("email");
      }

      isValid() {
         const ids = this.ids;
         let isValid = super.isValid();

         $$(ids.component).clearValidation();

         const isRequired = $$(ids.required).getValue();
         const emailDefault = $$(ids.default).getValue();

         if (isRequired || emailDefault) {
            if (!webix.rules.isEmail(emailDefault)) {
               $$(ids.component).markInvalid(
                  "default",
                  L("*This email is invalid")
               );
               isValid = false;
            } else isValid = true;
         } else isValid = true;

         return isValid;
      }

      populate(field) {
         const ids = this.ids;
         super.populate(field);

         if (field.settings.default === "") {
            $$(ids.defaultCheckbox).setValue(0);
         } else {
            $$(ids.defaultCheckbox).setValue(1);
         }
      }
   }

   return ABFieldEmail;
}
