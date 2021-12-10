/*
 * ABField
 * A Generic Property manager for All our fields.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var ABField = FFieldClass(AB);

   class ABFieldStringProperty extends ABField {
      constructor() {
         var base = "properties_abfield_string";
         super(base, {
            default: "",
            supportMultilingual: "",
         });
      }

      ui() {
         var ids = this.ids;
         return super.ui([
            {
               view: "text",
               id: ids.default,
               name: "default",
               labelWidth: uiConfig.labelWidthXLarge,
               label: L("Default"),
               placeholder: L("Enter default value"),
               on: {
                  onAfterRender() {
                     AB.ClassUI.CYPRESS_REF(this);
                  },
               },
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

      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("string");
      }
   }

   return ABFieldStringProperty;
}
