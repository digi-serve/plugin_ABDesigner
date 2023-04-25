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
         });
      }

      ui() {
         const ids = this.ids;
         return super.ui([
            // {
            //    view: "text",
            //    id: ids.default,
            //    name: "default",
            //    labelWidth: uiConfig.labelWidthXLarge,
            //    label: L("Default"),
            //    placeholder: L("Enter default value"),
            //    on: {
            //       onAfterRender() {
            //          AB.ClassUI.CYPRESS_REF(this);
            //       },
            //    },
            // },
            // {
            //    view: "checkbox",
            //    id: ids.supportMultilingual,
            //    name: "supportMultilingual",
            //    disallowEdit: true,
            //    labelRight: L("Support multilingual"),
            //    labelWidth: uiConfig.labelWidthCheckbox,
            //    value: false,
            //    on: {
            //       onAfterRender() {
            //          AB.ClassUI.CYPRESS_REF(this);
            //       },
            //    },
            // },
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
         return super._FieldClass("string");
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

   return ABFieldStringProperty;
}
