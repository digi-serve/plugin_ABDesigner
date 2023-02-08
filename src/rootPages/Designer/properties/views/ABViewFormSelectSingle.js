/*
 * ABViewFormSelectSingle
 * A Property manager for our ABViewFormSelectSingle definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_select_single";

   const ABViewFormItem = FABViewFormItem(AB);
   const L = ABViewFormItem.L();

   class ABViewFormSelectSingleProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            type: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "selectsingle";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.type,
               name: "type",
               view: "richselect",
               label: L("Type"),
               options: [
                  {
                     id: "richselect",
                     value: L("Select list"),
                  },
                  {
                     id: "radio",
                     value: L("Radio"),
                  },
               ],
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
         const ABViewFormSelectSinglePropertyComponentDefaults =
            this.defaultValues();

         $$(ids.type).setValue(
            view.settings.type ||
               ABViewFormSelectSinglePropertyComponentDefaults.type
         );
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = null;

         if (ViewClass) {
            values = ViewClass.defaultValues();
         }

         return values;
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
         return super._ViewClass("selectsingle");
      }
   }

   return ABViewFormSelectSingleProperty;
}
