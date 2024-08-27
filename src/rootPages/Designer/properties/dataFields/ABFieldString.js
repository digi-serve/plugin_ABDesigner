/*
 * ABField
 * A Generic Property manager for All our fields.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldStringProperty extends ABField {
      constructor(ibase = "properties_abfield") {
         super(`${ibase}_string`, {
            default: "",
            supportMultilingual: "",
            defaultCheckbox: "",
            maxLength: "",
            maxLengthCheckbox: "",
         });
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
                     width: 100,
                  },
                  {
                     id: ids.defaultCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv, ids.default);
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
            {
               cols: [
                  {
                     view: "label",
                     label: "Max Length",
                     align: "right",
                     width: 100,
                  },
                  {
                     id: ids.maxLengthCheckbox,
                     view: "checkbox",
                     width: 30,
                     value: 0,
                     on: {
                        onChange: (newv) => {
                           this.checkboxDefaultValue(newv, ids.maxLength);
                        },
                        onAfterRender: () => {
                           AB.ClassUI.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     view: "text",
                     type: "number",
                     id: ids.maxLength,
                     name: "maxLength",
                     placeholder: L("Enter Max Length value"),
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
            {
               view: "checkbox",
               id: ids.supportMultilingual,
               name: "supportMultilingual",
               disallowEdit: true,
               labelRight: L("Support multilingual"),
               labelWidth: uiConfig.labelWidthCheckbox,
               value: false,
               on: {
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
            },
         ]);
      }

      checkboxDefaultValue(state, id) {
         if (state === 0) {
            $$(id).disable();
            $$(id).setValue("");
         } else {
            $$(id).enable();
         }
      }

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("string");
      }

      populate(field) {
         const ids = this.ids;
         super.populate(field);
     
         $$(ids.defaultCheckbox).setValue(field.settings.default === "" ? 0 : 1);
         $$(ids.maxLengthCheckbox).setValue(field.settings.maxLength === "" ? 0 : 1);
     }

   }

   return ABFieldStringProperty;
}
