/*
 * ABFieldBoolean
 * A Property manager for our ABFieldBoolean.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldBoolean extends ABField {
      constructor() {
         super("properties_abfield_boolean", {});
      }

      ui() {
         return super.ui([
            {
               name: "default",
               view: "checkbox",
               label: L("Default"),
               labelPosition: "left",
               labelWidth: 70,
               labelRight: L("Uncheck"),
               css: "webix_table_checkbox",
               on: {
                  onChange: function (newVal) {
                     let checkLabel = L("Check");
                     let uncheckLabel = L("Uncheck");

                     this.define(
                        "labelRight",
                        newVal ? checkLabel : uncheckLabel
                     );
                     this.refresh();
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
         return super._FieldClass("boolean");
      }
   }

   return ABFieldBoolean;
}
