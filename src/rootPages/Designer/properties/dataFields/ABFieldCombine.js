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
      constructor(ibase = "properties_abfield") {
         super(`${ibase}_combine`, {
            combinedFields: "",
            delimiter: "",
         });
      }

      ui() {
         const ids = this.ids;
         const FC = this.FieldClass();

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Combined Fields:"),
                     align: "right",
                     width: 125,
                  },
                  {
                     id: ids.combinedFields,
                     name: "combinedFields",
                     view: "multicombo",
                     labelWidth: uiConfig.labelWidthXLarge,
                     disallowEdit: true,
                     options: [],
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            {
               cols: [
                  {
                     view: "label",
                     label: L("Delimiter:"),
                     align: "right",
                     width: 125,
                  },
                  {
                     id: ids.delimiter,
                     view: "richselect",
                     name: "delimiter",
                     value: FC.defaultValues().delimiter,
                     labelWidth: uiConfig.labelWidthXLarge,
                     disallowEdit: true,
                     options: [
                        { id: "plus", value: L("Plus ( + )") },
                        { id: "dash", value: L("Dash ( - )") },
                        { id: "period", value: L("Period ( . )") },
                        { id: "space", value: L("Space ( )") },
                     ],
                     on: {
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
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
         return super._FieldClass("combined");
      }

      show() {
         const ids = this.ids;

         const fields = this.CurrentObject.fields((f) => {
            return (
               [
                  "string",
                  "LongText",
                  "number",
                  "date",
                  "datetime",
                  "boolean",
                  "list",
                  "email",
                  "user",
                  "AutoIndex",
                  "combined",
               ].indexOf(f.key) > -1 ||
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

         const $combinedFields = $$(ids.combinedFields);
         if ($combinedFields) {
            $combinedFields.define("options", fields);
            $combinedFields.refresh();
         }
      }
   }

   return ABFieldCombine;
}
