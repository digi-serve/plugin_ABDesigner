/*
 * ABViewChart
 * A Property manager for our ABViewChart definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_org_chart";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewOrgChartProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollectionID: "",
            fields: "",
            direction: "",
            depth: "",
            color: "",
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
               id: ids.datacollectionID,
               name: "datacollectionID",
               view: "richselect",
               label: L("Data Collection"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: (value) => {
                     this.CurrentView.settings.datacollectionID = value;
                     this.populateSubValueFieldOptions(
                        this.CurrentView?.datacollection?.datasource
                     );
                     this.onChange();
                  },
               },
            },
            {
               cols: [
                  {
                     view: "label",
                     label: "Fields",
                     width: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fields,
                     name: "fields",
                     view: "tree",
                     template:
                        "{common.icon()} {common.checkbox()} <span>#value#</span>",
                     select: false,
                     height: 200,
                     data: [],
                     on: {
                        onItemCheck: () => {
                           const fieldValues = $$(this.ids.fields).getChecked();
                           this.refreshValueFieldOptions(fieldValues);
                           this.onChange();
                        },
                     },
                  },
               ],
            },
            {
               id: ids.direction,
               name: "direction",
               view: "richselect",
               label: L("Direction"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [
                  { id: "t2b", value: L("Top to Bottom") },
                  { id: "b2t", value: L("Bottom to Top") },
                  { id: "l2r", value: L("Left to Right") },
                  { id: "r2l", value: L("Right to Left") },
               ],
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.depth,
               name: "depth",
               view: "counter",
               label: L("Depth"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.color,
               name: "color",
               view: "colorpicker",
               label: L("Color"),
               labelWidth: uiConfig.labelWidthLarge,
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

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const $component = $$(ids.component);
         const defaultValues = this.defaultValues();
         const values = Object.assign(
            $component.getValues(),
            Object.assign(defaultValues, view.settings)
         );

         const $fieldList = $$(ids.fields);
         $fieldList.clearAll();

         this.populateDatacollection(values.datacollectionId);
         // this.populateDescriptionFieldOptions(values.columnDescription);

         const fieldValues = (view.settings?.fields ?? "").split(",");
         this.refreshValueFieldOptions(fieldValues);

         $component.setValues(values);
      }

      populateDatacollection(datacollectionId) {
         const $dataCollection = $$(this.ids.datacollectionID);

         // Pull data collections to options
         const dcOptions = this.CurrentView.application
            .datacollectionsIncluded()
            .map((d) => {
               return { id: d.id, value: d.label };
            });
         $dataCollection.define("options", dcOptions);
         $dataCollection.define("value", datacollectionId);
         $dataCollection.refresh();
      }

      refreshValueFieldOptions(fieldValues = []) {
         const ids = this.ids;
         const view = this.CurrentView;
         const $fieldList = $$(ids.fields);

         $fieldList.clearAll();

         // Populate 1:M fields option of the root object
         this.populateSubValueFieldOptions(view.datacollection?.datasource);

         // Populate sub 1:M fields option of each fields
         fieldValues.forEach((fId) => {
            if (!fId) return;

            const $fieldItem = $fieldList.getItem(fId);
            if ($fieldItem) {
               const abField = $fieldItem.field;
               this.populateSubValueFieldOptions(abField.datasourceLink, fId);
            }
         });

         // Set check items
         $fieldList.blockEvent();
         fieldValues.forEach((fId) => {
            if ($fieldList.exists(fId)) $fieldList.checkItem(fId);
         });
         $fieldList.unblockEvent();
      }

      populateSubValueFieldOptions(object, parentFieldId) {
         const view = this.CurrentView;
         const $fields = $$(this.ids.fields);

         view.getValueFields(object).forEach((f, index) => {
            if ($fields.exists(f.id)) return;
            $fields.add(
               {
                  id: f.id,
                  value: f.label,
                  field: f,
               },
               index,
               parentFieldId
            );
         });

         $fields.openAll();
      }

      // populateDescriptionFieldOptions(fieldId) {
      //    const valueField = this.CurrentView.valueField();
      //    const $columnDescription = $$(this.ids.columnDescription);

      //    const connectFieldOpts =
      //       valueField?.datasourceLink
      //          ?.fields?.((f) => f.key != "connectObject")
      //          .map?.((f) => {
      //             return {
      //                id: f.id,
      //                value: f.label,
      //             };
      //          }) ?? [];
      //    $columnDescription.define("options", connectFieldOpts);
      //    $columnDescription.define("value", fieldId);
      //    $columnDescription.refresh();
      // }

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
         values.settings.fields = $$(ids.fields).getChecked().join(",");

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
