/*
 * ABFieldBoolean
 * A Property manager for our ABFieldBoolean.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldBoolean extends ABField {
      constructor(ibase = "properties_abfield") {
         super(`${ibase}_boolean`, {
            checkBoxLabel: "",
            default: "",
         });
      }

      ui() {
         const ids = this.ids;
         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Default:"),
                     align: "right",
                     width: 65,
                  },
                  {
                     id: ids.default,
                     name: "default",
                     view: "checkbox",
                     css: "webix_table_checkbox",
                     width: 30,
                     on: {
                        onChange: (newVal) => {
                           let checkLabel = L("Check");
                           let uncheckLabel = L("Uncheck");

                           $$(ids.checkBoxLabel).setValue(
                              newVal ? checkLabel : uncheckLabel
                           );
                        },
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
                  {
                     id: ids.checkBoxLabel,
                     view: "label",
                     label: L("Uncheck"),
                     width: 60,
                  },
               ],
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
         return super._FieldClass("boolean");
      }
   }

   return ABFieldBoolean;
}
