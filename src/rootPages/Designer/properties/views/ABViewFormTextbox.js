/*
 * ABViewFormTextbox
 * A Property manager for our ABViewFormTextbox definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_textbox";

   const ABViewFormItem = FABViewFormItem(AB);
   const L = ABViewFormItem.L();

   class ABViewFormTextboxProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            type: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "textbox";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.type,
               name: "type",
               view: "radio",
               label: L("Type"),
               vertical: true,
               options: [
                  {
                     id: "single",
                     value: L("Single line"),
                  },
                  {
                     id: "multiple",
                     value: L("Multiple lines"),
                  },
                  {
                     id: "rich",
                     value: L("Rich editor"),
                  },
               ],
               on: {
                  onChange: () => this.onChange(),
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const ABViewFormTextboxPropertyComponentDefaults =
            this.defaultValues();

         $$(ids.type).setValue(
            view.settings.type ||
               ABViewFormTextboxPropertyComponentDefaults.type
         );
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
         values.settings.type = $$(ids.type).getValue();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("textbox");
      }
   }

   return ABViewFormTextboxProperty;
}
