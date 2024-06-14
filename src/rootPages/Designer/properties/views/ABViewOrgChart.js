/*
 * ABViewChart
 * A Property manager for our ABViewChart definitions
 */

import FABViewContainer from "./ABViewContainer";

export default function (AB) {
   const BASE_ID = "properties_abview_org_chart";

   const ABViewContainer = FABViewContainer(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABViewContainer.L();

   class ABViewOrgChartProperty extends ABViewContainer {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",
            columnLabel: "",
            direction: "",
            pan: "",
            zoom: "",
            height: "",
            export: "",
            exportFilename: "",
         });

         this.AB = AB;
      }

      static get key() {
         return "orgchart";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.dataviewID,
               name: "dataviewID",
               view: "richselect",
               label: L("Chart Data"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.columnLabel,
               name: "columnLabel",
               view: "richselect",
               label: L("Label Column"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.direction,
               name: "direction",
               view: "richselect",
               label: L("Direction"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [
                  { id: "Top to Bottom", value: "t2b" },
                  { id: "Bottom to Top", value: "b2t" },
                  { id: "Left to Right", value: "l2r" },
                  { id: "Right to Left", value: "r2l" },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.visibleLevel,
               name: "visibleLevel",
               view: "counter",
               label: L("Visible Level"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.pan,
               name: "pan",
               view: "checkbox",
               label: L("Pan"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.zoom,
               name: "zoom",
               view: "checkbox",
               label: L("Zoom"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               view: "fieldset",
               label: L("Export"),
               body: {
                  view: "layout",
                  borderless: true,
                  rows: [
                     {
                        id: ids.export,
                        name: "export",
                        view: "checkbox",
                        label: L("Is Exportable"),
                        labelWidth: uiConfig.labelWidthLarge,
                        value: 0,
                        on: {
                           onChange: () => {
                              this.onChange();
                           },
                        },
                     },
                     {
                        id: ids.exportFilename,
                        view: "text",
                        name: "exportFilename",
                        label: L("File name"),
                        placeholder: L("Enter file name"),
                        labelWidth: uiConfig.labelWidthLarge,
                     },
                  ],
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         webix.extend($$(this.ids.component), webix.ProgressBar);
      }

      // updateCharts() {
      //    // UPDATE charts when parent properties are changed
      //    this.CurrentView.refreshData();

      //    // baseView.views().forEach((e) => {
      //    //    e.parent.refreshData();
      //    // });
      // }

      // populateDataview() {
      //    // Pull data collections to options
      //    // / NOTE: only include System Objects if the user has permission
      //    const datacollectionFilter = this.AB.Account.isSystemDesigner()
      //       ? (obj) => !obj.isSystemObject
      //       : () => true;
      //    const datacollections =
      //       this.CurrentApplication.datacollectionsIncluded(
      //          datacollectionFilter
      //       );

      //    // Set the objects you can choose from in the list
      //    const $dataviewID = $$(this.ids.dataviewID);

      //    $dataviewID.define(
      //       "options",
      //       datacollections.map((e) => {
      //          return {
      //             id: e.id,
      //             value: e.label,
      //          };
      //       })
      //    );
      //    $dataviewID.refresh();
      // }

      // populateFieldOptions() {
      //    const baseView = this.CurrentView;
      //    const dc = baseView.datacollection;

      //    if (!dc) return;

      //    const obj = dc.datasource;

      //    if (!obj) return;

      //    const ids = this.ids;
      //    const $columnLabel = $$(ids.columnLabel);
      //    const $columnValue = $$(ids.columnValue);

      //    $columnLabel.define(
      //       "options",
      //       obj.fields().map((e) => {
      //          return {
      //             id: e.id,
      //             value: e.columnName,
      //             key: e.key,
      //          };
      //       })
      //    );
      //    $columnLabel.refresh();
      //    $columnValue.define(
      //       "options",
      //       obj
      //          .fields(
      //             (f) =>
      //                f.key === "number" ||
      //                f.key === "formula" ||
      //                f.key === "calculate"
      //          )
      //          .map((e) => {
      //             return {
      //                id: e.id,
      //                value: e.columnName,
      //                key: e.key,
      //             };
      //          })
      //    );
      //    $columnValue.refresh();
      // }

      // populateFieldOptions2() {
      //    const baseView = this.CurrentView;
      //    const dc = baseView.datacollection;

      //    if (!dc) return;

      //    const obj = dc.datasource;

      //    if (!obj) return;

      //    const $columnValue2 = $$(this.ids.columnValue2);

      //    $columnValue2.define(
      //       "options",
      //       obj
      //          .fields(
      //             (f) =>
      //                f.key === "number" ||
      //                f.key === "formula" ||
      //                f.key === "calculate"
      //          )
      //          .map((e) => {
      //             return {
      //                id: e.id,
      //                value: e.columnName,
      //                key: e.key,
      //             };
      //          })
      //    );
      //    $columnValue2.enable();
      //    $columnValue2.refresh();
      // }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const $component = $$(ids.component);
         const defaultValues = this.defaultValues();
         const values = Object.assign(
            $component.getValues(),
            Object.assign(defaultValues, view.settings)
         );

         // this.populateDataview();
         // this.populateFieldOptions();

         // if (values.multipleSeries) this.populateFieldOptions2();

         $component.setValues(values);
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
         const values = super.values();
         const ids = this.ids;
         const $component = $$(ids.component);

         values.settings = Object.assign(
            $component.getValues(),
            values.settings
         );

         // Retrive the values of your properties from Webix and store them in the view

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("orgchart");
      }
   }

   return ABViewOrgChartProperty;
}
