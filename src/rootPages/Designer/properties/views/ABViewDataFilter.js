/*
 * ABViewDataFilter
 * A Property manager for our ABViewDataFilter definitions
 */

import FABView from "./ABView";
import ABFieldConnect from "../dataFields/ABFieldConnect";

export default function (AB) {
   const uiConfig = AB.Config.uiSettings();
   const BASE_ID = "properties_abview_data_filter";

   const ABView = FABView(AB);
   const L = ABView.L();

   class ABViewDataFilterProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            // Put our ids here
            datacollection: "",
            fields: "",
            custom_filters: "",
            custom_sort: "",
            batch: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "data-filter";
      }

      ui() {
         let ids = this.ids;

         return super.ui([
            {
               id: ids.batch,
               visibleBatch: "advanced",
               rows: [
                  {
                     id: ids.viewtype,
                     name: "viewType",
                     view: "combo",
                     label: L("Display as"),
                     labelWidth: uiConfig.labelWidthLarge,
                     on: {
                        onChange: (newVal, oldVal) => {
                           if (newVal != oldVal) {
                              $$(ids.batch).showBatch(newVal);
                              this.onChange();
                           }
                        },
                     },
                     options: [
                        { id: "advanced", value: "Search & filter" },
                        { id: "connected", value: "Connected field" },
                     ],
                  },
                  {
                     id: ids.datacollection,
                     name: "dataviewID",
                     view: "combo",
                     label: L("Datacollection"),
                     labelWidth: uiConfig.labelWidthLarge,
                     on: {
                        onChange: (newVal, oldVal) => {
                           if (newVal != oldVal) {
                              this.populateFields(newVal);
                              this.onChange();
                           }
                        },
                     },
                  },
                  {
                     id: ids.fields,
                     batch: "connected",
                     name: "field",
                     view: "combo",
                     label: L("Field"),
                     labelWidth: uiConfig.labelWidthLarge,
                     on: {
                        onChange: () => {
                           this.onChange();
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     batch: "advanced",
                     id: ids.custom_filters,
                     label: "Show Filters",
                     labelWidth: uiConfig.labelWidthLarge,
                     name: "showFilter",
                     on: {
                        onChange: () => {
                           this.onChange();
                        },
                     },
                  },
                  {
                     view: "checkbox",
                     batch: "advanced",
                     id: ids.custom_sort,
                     label: "Show Sort",
                     labelWidth: uiConfig.labelWidthLarge,
                     name: "showSort",
                     on: {
                        onChange: () => {
                           this.onChange();
                        },
                     },
                  },
                  {},
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
         let ids = this.ids;
         if (!view) return;

         const $component = $$(ids.component);

         const defaultValues = this.defaultValues();
         let values = $component.getValues();

         // set default values
         for (const key in defaultValues)
            values[key] = defaultValues[key] || values[key];

         // set values saved on server
         for (const key in view.settings)
            values[key] = view.settings[key] || values[key];

         let datacollectionId = values.dataviewID ? values.dataviewID : null;
         var SourceSelector = $$(ids.datacollection);

         // Pull data collections to options
         var dcOptions = view.application
            .datacollectionsIncluded()
            .filter((dc) => {
               var obj = dc.datasource;
               return dc.sourceType == "object" && obj && !obj.isImported;
            })
            .map((d) => {
               let entry = { id: d.id, value: d.label };
               if (d.sourceType == "query") {
                  entry.icon = "fa fa-filter";
               } else {
                  entry.icon = "fa fa-database";
               }
               return entry;
            });
         SourceSelector.define("options", dcOptions);
         SourceSelector.define("value", view.datacollection);
         SourceSelector.refresh();

         // if there is a data collection we want to get all connected fields
         if (datacollectionId) {
            this.populateFields(datacollectionId);
         }
         // debugger;
         // $$(ids.labelPosition).setValue(
         //    view.settings.labelPosition ||
         //       ABViewFormPropertyComponentDefaults.labelPosition
         // );
         $component.setValues(values);
      }

      populateFields(datacollectionId) {
         let ids = this.ids;
         // get data collection
         let datacollection = this.AB.datacollectionByID(datacollectionId);
         let object = datacollection ? datacollection.datasource : null;
         // Pull connected fields to options
         var fieldOptions = [];
         fieldOptions = object.connectFields().map((f) => {
            return { id: f.columnName, value: f.label };
         });

         $$(ids.fields).define("options", fieldOptions);
         $$(ids.fields).refresh();
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

         const values = super.values();

         values.settings = $component.getValues();
         values.text = values.settings.text;

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("data-filter");
      }
   }

   return ABViewDataFilterProperty;
}
