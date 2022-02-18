/*
 * ABFieldTextFormula
 * A Property manager for our ABFieldTextFormula.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldTextFormula extends ABField {
      constructor() {
         super("properties_abfield_textformula", {
            textFormula: "",
            formulaSuggest: "",
         });
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "layout",
               cols: [
                  {
                     id: ids.textFormula,
                     view: "textarea",
                     // label: L("Text Formula"),
                     name: "textFormula",
                     editor: "text",
                     labelWidth: uiConfig.labelWidthLarge,
                     placeholder: L("Text Formula"),
                  },
                  { view: "spacer", width: 15 },
                  {
                     view: "layout",
                     rows: [
                        { view: "spacer", height: 5 },
                        {
                           id: ids.formulaSuggest,
                           name: "formulaSuggest",
                           view: "dataview",
                           xCount: 1,
                           // yCount: 2.8,
                           // hidden: true,
                           select: true,
                           type: {
                              height: 30,
                              width: 246,
                           },
                           template: "#value#",
                           on: {
                              onItemClick: (id) => {
                                 const item = $$(ids.formulaSuggest).getItem(
                                    id
                                 );
                                 const inputSuggestString =
                                    item.type == "field"
                                       ? "{" + item.value + "}"
                                       : item.value;
                                 $$(ids.textFormula).setValue(
                                    $$(ids.textFormula).getValue() +
                                       inputSuggestString
                                 );
                                 $$(ids.formulaSuggest).unselect();
                              },
                           },
                        },
                        { view: "spacer", height: 5 },
                     ],
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
         return super._FieldClass("TextFormula");
      }
      show() {
         super.show();
         this.loadSuggestions();
      }

      populate(field) {
         super.populate(field);
         this.loadSuggestions();
      }

      loadSuggestions() {
         const ids = this.ids;
         const FC = this.FieldClass();
         // Load the object's fields
         const fields = this.CurrentObject.fields()
            .filter((field) => {
               return (
                  field.key != "formula" &&
                  field.key != "TextFormula" &&
                  !field.isConnection
               );
            })
            .map((field) => {
               return {
                  id: field.id,
                  value: field.columnName,
                  type: "field",
               };
            });
         // Add the common options
         const formulaData = fields.concat(FC.getBuildInFunction());
         $$(ids.formulaSuggest).clearAll();
         $$(ids.formulaSuggest).parse(formulaData);
      }
   }

   return ABFieldTextFormula;
}
