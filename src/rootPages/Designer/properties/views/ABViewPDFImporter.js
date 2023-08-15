/*
 * ABViewPDFImporter
 * A Property manager for our ABViewPDFImporter definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_pdfImporter";

   const ABView = FABView(AB);
   const L = ABView.L();
   const uiConfig = AB.UISettings.config();

   class ABViewPDFImporterProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollection: "",
            field: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "pdfImporter";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               view: "fieldset",
               label: L("Data:"),
               labelWidth: uiConfig.labelWidthLarge,
               body: {
                  type: "clean",
                  padding: 10,
                  rows: [
                     {
                        id: ids.datacollection,
                        name: "dataviewID",
                        view: "richselect",
                        label: L("Data Source"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: (dcId, oldDcId) => {
                              if (dcId == oldDcId) return;
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.field,
                        name: "fieldID",
                        view: "richselect",
                        label: L("Field"),
                        labelWidth: uiConfig.labelWidthLarge,
                        on: {
                           onChange: (dcId, oldDcId) => {
                              if (dcId == oldDcId) return;
                              this.onChange();
                           },
                        },
                     },
                  ],
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

         const $dc = $$(ids.datacollection);
         const dcID = view.settings.dataviewID;

         // Pull data collections to options
         const dcOptions = view.application
            .datacollectionsIncluded()
            .filter((d) => d.sourceType == "object")
            .map((d) => {
               return {
                  id: d.id,
                  value: d.label,
                  icon: "fa fa-database",
               };
            });
         $dc.define("options", dcOptions);
         $dc.define("value", dcID);
         $dc.refresh();

         // Pull fields to options
         const $field = $$(ids.field);
         const fieldID = view.settings.fieldID;
         if (view.settings.dataviewID) {
            const obj = this.AB.datacollectionByID(
               view.settings.dataviewID
            )?.datasource;

            const fieldOptions =
               obj
                  ?.fields((f) => f.key == "image")
                  ?.map((f) => {
                     return {
                        id: f.id,
                        value: f.label,
                        icon: "fa fa-file-image-o",
                     };
                  }) ?? [];

            $field.define("options", fieldOptions);
         }
         $field.define("value", fieldID);
         $field.refresh();
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const $component = $$(this.ids.component);

         const values = super.values();

         values.settings = $component.getValues();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("pdfImporter");
      }
   }

   return ABViewPDFImporterProperty;
}
