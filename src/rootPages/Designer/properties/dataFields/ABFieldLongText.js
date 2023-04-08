/*
 * ABFieldLongText
 * A Property manager for our ABFieldLongText.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldLongText extends ABField {
      constructor(ibase = "properties_abfield") {
         super(`${ibase}_longtext`, {
            default: "",
            defaultCheckbox: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "layout",
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
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.default,
                     view: "text",
                     name: "default",
                     placeholder: L("Enter default value"),
                     disabled: true,
                     labelWidth: uiConfig.labelWidthXLarge,
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               view: "checkbox",
               name: "supportMultilingual",
               disallowEdit: true,
               labelRight: L("Support multilingual"),
               labelWidth: uiConfig.labelWidthCheckbox,
               value: false,
               on: {
                  onAfterRender: function () {
                     ABField.CYPRESS_REF(this);
                  },
               },
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
         return super._FieldClass("LongText");
      }

      populate(field) {
         super.populate(field);
         const value = field.settings.default === "" ? 0 : 1;
         $$(this.ids.defaultCheckbox).setValue(value);
      }

      show() {
         super.show();
         $$(this.ids.defaultCheckbox).setValue(0);
      }

      checkboxDefaultValue(state) {
         if (state == 0) {
            $$(this.ids.default).disable();
            $$(this.ids.default).setValue("");
         } else {
            $$(this.ids.default).enable();
         }
      }
   }

   return ABFieldLongText;
}
