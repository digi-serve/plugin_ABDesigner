/*
 * ABFieldFormula
 * A Property manager for our ABFieldFormula.
 */

import FFieldClass from "./ABField";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();

   const ABField = FFieldClass(AB);
   const L = ABField.L();

   class ABFieldFormula extends ABField {
      constructor() {
         super("properties_abfield_formula", {
            field: "",
            fieldList: "",
         });
      }

      ui() {
         const App = AB._App;
         const FC = this.FieldClass();
         const ids = this.ids;

         this.rowFilter = AB.rowfilterNew(App, ids.component);

         return super.ui([
            {
               cols: [
                  {
                     view: "label",
                     label: L("Type:"),
                     align: "right",
                     width: 40,
                  },
                  {
                     view: "richselect",
                     name: "type",
                     labelWidth: uiConfig.labelWidthMedium,
                     value: "sum",
                     options: [
                        { id: "sum", value: L("Sum") },
                        { id: "max", value: L("Max") },
                        { id: "min", value: L("Min") },
                        {
                           id: "average",
                           value: L("Average"),
                        },
                        {
                           id: "count",
                           value: L("Count"),
                        },
                     ],
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
                     label: L("Field:"),
                     align: "right",
                     width: 40,
                  },
                  {
                     id: ids.field,
                     view: "richselect",
                     name: "field",
                     labelWidth: uiConfig.labelWidthMedium,
                     options: {
                        view: "suggest",
                        body: {
                           id: ids.fieldList,
                           view: "list",
                           template: this.itemTemplate,
                           data: [],
                        },
                     },
                     on: {
                        onChange: () => {
                           this.refreshFilter();
                        },
                        onAfterRender: function () {
                           ABField.CYPRESS_REF(this);
                        },
                     },
                  },
               ],
            },
            this.rowFilter.ui,
         ]);
      }

      getFieldList() {
         const options = [];

         const connectFields = this.CurrentObject.connectFields();
         connectFields.forEach((f) => {
            const objLink = f.datasourceLink;

            objLink.fields().forEach((fLink) => {
               // pull 'number' and 'calculate' fields from link objects
               // if (fLink.key == "number" || fLink.key == "calculate") {
               // NOTE: calculate fields does not support in queries
               if (fLink.key == "number") {
                  // NOTE: calculate fields does not support in queries
                  options.push({
                     // UUID:UUID
                     id: `${f.id}:${fLink.id}`,
                     field: f,
                     fieldLink: fLink,
                  });
               }
            });
         });

         return options;
      }

      itemTemplate(opt) {
         return `[${opt.field.label}] ${opt.fieldLink.object.label} -> <i class="fa fa-${opt.fieldLink.icon}" aria-hidden="true"></i><b>${opt.fieldLink.label}</b>`;
      }

      getSelectedField() {
         const ids = this.ids;

         const selectedId = $$(ids.field).getValue(); // fieldId:fieldLinkId
         const selectedField = $$(ids.field)
            .getList()
            .data.find({ id: selectedId })[0];

         return selectedField;
      }

      refreshFilter() {
         const selectedField = this.getSelectedField();
         if (
            selectedField &&
            selectedField.fieldLink &&
            selectedField.fieldLink.object
         ) {
            // ABFieldFormulaComponent.rowFilter.applicationLoad(
            //    selectedField.fieldLink.object.application
            // );
            this.rowFilter.fieldsLoad(selectedField.fieldLink.object.fields());
            // ABFieldFormulaComponent.rowFilter.setValue({});
         } else {
            // ABFieldFormulaComponent.rowFilter.applicationLoad(null);
            this.rowFilter.fieldsLoad([]);
            // ABFieldFormulaComponent.rowFilter.setValue({});
         }
      }
      /**
       * @method FieldClass()
       * Call our Parent's _FieldClass() helper with the proper key to return
       * the ABFieldXXX class represented by this Property Editor.
       * @return {ABFieldXXX Class}
       */
      FieldClass() {
         return super._FieldClass("formula");
      }

      populate(field) {
         const ids = this.ids;

         super.populate(field);

         if (field.settings.field) {
            const selectedId = `${field.settings.field}:${field.settings.fieldLink}`;
            $$(ids.field).setValue(selectedId || "");
         } else {
            $$(ids.field).setValue("");
         }

         this.refreshFilter();
         this.rowFilter.setValue(field.settings.where || {});
      }

      show() {
         const ids = this.ids;
         const list = this.getFieldList();

         $$(ids.fieldList).clearAll();
         $$(ids.fieldList).parse(list);
         super.show();
      }

      values() {
         const ids = this.ids;
         const settings = $$(ids.component).getValues();
         const selectedField = this.getSelectedField();

         if (selectedField) {
            settings.field = selectedField.field.id;
            settings.fieldLink = selectedField.fieldLink.id;
            settings.object = selectedField.fieldLink.object.id;
         } else {
            settings.field = "";
            settings.fieldLink = "";
            settings.object = "";
         }

         settings.where = this.rowFilter.getValue();

         $$(ids.component).setValues(settings);

         return super.values();
      }
   }

   return ABFieldFormula;
}
