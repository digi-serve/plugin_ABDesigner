/*
 * ABViewFormJson
 * A Property manager for our ABViewFormJson definitions
 */

import FABViewFormItem from "./ABViewFormItem";

export default function (AB) {
   const BASE_ID = "properties_abview_form_json";

   const ABViewFormItem = FABViewFormItem(AB);
   const L = ABViewFormItem.L();

   class ABViewFormJsonProperty extends ABViewFormItem {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            type: "",
            filterField: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "json";
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
                     id: "string",
                     value: L("JSON String"),
                  },
                  {
                     id: "systemObject",
                     value: L("System Object Chooser UI"),
                  },
                  {
                     id: "filter",
                     value: L("Filter UI"),
                  },
               ],
               on: {
                  onChange: (newValue) => {
                     if (newValue == "filter") {
                        $$(ids.filterField).show();
                     } else {
                        $$(ids.filterField).hide();
                     }
                     this.onChange();
                  },
               },
            },
            {
               id: ids.filterField,
               name: "filterField",
               view: "combo",
               hidden: true,
               label: L("Object Field to Filter"),
               labelPosition: "top",
               placeholder: L("Select a field to filter by"),
               // options: look at populate
               on: {
                  onChange: (newValue) => {
                     this.onChange();
                  },
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
         const ABViewFormJsonPropertyComponentDefaults = this.defaultValues();

         // set the options for the filterField
         let filterFieldOptions = [{ id: "", value: "" }];
         view.parent.views().forEach((element) => {
            if (
               element.key == "json" &&
               element.settings.type == "systemObject"
            ) {
               let formElementsDefs = view.AB.definitionByID(
                  element.settings.fieldId
               );
               let formComponent = view.parent.viewComponents[element.id];
               filterFieldOptions.push({
                  id: element.id,
                  value: formComponent.settings.fieldLabel,
               });
            }
         });
         $$(ids.filterField).define("options", filterFieldOptions);

         if (view.settings.filterField)
            $$(ids.filterField).setValue(view.settings.filterField);

         $$(ids.type).setValue(
            view.settings.type || ABViewFormJsonPropertyComponentDefaults.type
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
         return super._ViewClass("json");
      }
   }

   return ABViewFormJsonProperty;
}
