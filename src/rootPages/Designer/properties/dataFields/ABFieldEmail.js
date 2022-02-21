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
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "text",
               id: ids.default,
               name: "default",
               labelWidth: uiConfig.labelWidthXLarge,
               label: L("Default"),
               placeholder: L("Enter default value"),
            },
         ]);
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
   }

   return ABFieldEmail;
}
