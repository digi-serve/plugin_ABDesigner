import UI_Class from "../../ui_class";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   class ABProcessTaskServiceAccounting extends UIClass {
      constructor(...params) {
         super(...params);
      }

      _getFieldOptions(objID) {
         // create a new options array of Field Choices for the given obj.id

         const fields = [
            {
               value: L("Select a Field"),
            },
         ];
         if (objID) {
            const obj = this.CurrentApplication.objectsIncluded().find(
               (o) => o.id == objID
            );
            obj?.fields().forEach((f) => {
               fields.push({ id: f.id, value: f.label, field: f });
            });
         }
         return fields;
      }

      _updateFieldOptions(optionIds, items) {
         // update the list of field select choices with the new field choices
         optionIds.forEach((optId) => {
            const $selector = $$(optId);
            if ($selector) {
               $selector.define("options", items);
               $selector.refresh();
               $selector.show();
            }
         });
      }

      _getListFieldOptions(options = {}) {
         let listField;

         if (options.field) {
            listField = options.field;
         } else if (options.objectId && options.fieldId) {
            const object = this.AB.objectByID(options.objectId);

            listField = object?.fieldByID(options.fieldId);
         }

         const values = [{ value: L("Select the value") }];
         (listField?.options?.() ?? listField?.settings?.options ?? []).forEach(
            (o) => {
               values.push({ id: o.id, value: o.text });
            }
         );
         return values;
      }
   }

   return ABProcessTaskServiceAccounting;
}
