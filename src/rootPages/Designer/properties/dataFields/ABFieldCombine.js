/*
 * ABFieldCombine
 * A Property manager for our ABFieldCombine.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldCombine extends ABField {
      constructor() {
         super("properties_abfield_combine", {
            combinedFields: "",
         });
      }

      ui() {
         const ids = this.ids;
         const FC = this.FieldClass();

         return super.ui([
            {
               id: ids.combinedFields,
               name: "combinedFields",
               view: "multicombo",
               label: L("Combined Fields"),
               labelWidth: uiConfig.labelWidthXLarge,
               disallowEdit: true,
               options: [],
            },
            {
               view: "richselect",
               name: "delimiter",
               label: L("Delimiter"),
               value: FC.defaultValues().delimiter,
               labelWidth: uiConfig.labelWidthXLarge,
               disallowEdit: true,
               options: [
                  { id: "plus", value: L("Plus ( + )") },
                  { id: "dash", value: L("Dash ( - )") },
                  { id: "period", value: L("Period ( . )") },
                  { id: "space", value: L("Space ( )") },
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
         return super._FieldClass("combined");
      }

      isValid() {
         const isValid = super.isValid();

         // validator.addError('columnName', L('ab.validation.object.name.unique', 'Field columnName must be unique (#name# already used in this Application)').replace('#name#', this.name) );

         return isValid;
      }

      show() {
         const ids = this.ids;

         let fields = this.CurrentObject.fields((f) => {
            return (
               f.key == "string" ||
               f.key == "LongText" ||
               f.key == "number" ||
               f.key == "date" ||
               f.key == "datetime" ||
               f.key == "boolean" ||
               f.key == "list" ||
               f.key == "email" ||
               f.key == "user" ||
               f.key == "AutoIndex" ||
               f.key == "combined" ||
               (f.isConnection &&
                  // 1:M
                  ((f.settings.linkType == "one" &&
                     f.settings.linkViaType == "many") ||
                     // 1:1 isSource = true
                     (f.settings.linkType == "one" &&
                        f.settings.linkViaType == "one" &&
                        f.settings.isSource)))
            );
         }).map((f) => {
            return {
               id: f.id,
               value: f.label,
            };
         });

         super.show();

         let $combinedFields = $$(ids.combinedFields);
         if ($combinedFields) {
            $combinedFields.define("options", fields);
            $combinedFields.refresh();
         }
      }
   }

   return ABFieldCombine;
}
