/*
 * ABViewDetailItem
 * A Property manager for our ABViewDetailItem definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const ABView = FABView(AB);
   const L = ABView.L();

   class ABViewDetailItemProperty extends ABView {
      constructor(BASE_ID, ids = {}) {
         super(
            BASE_ID,
            Object.assign(ids, {
               // Put our ids here
               field: "",
            })
         );

         this.AB = AB;
      }

      ui(elements = [], rules = {}) {
         const ids = this.ids;
         const _ui = [
            {
               id: ids.field,
               name: "fieldLabel",
               view: "text",
               disabled: true,
               label: L("Field"),
            },
         ].concat(elements);

         return super.ui(_ui, rules);
      }

      populate(view) {
         super.populate(view);

         const [field] = this.AB.objectByID(view.settings.objectId).fields(
            (f) => f.id == view.settings.fieldId
         );

         $$(this.ids.field).setValue(field.label);
      }

      defaultValues() {
         const ViewClass = this.ViewClass();

         let values = {};

         if (ViewClass) {
            values = ViewClass.defaultValues();
         }

         return values;
      }
   }

   return ABViewDetailItemProperty;
}
