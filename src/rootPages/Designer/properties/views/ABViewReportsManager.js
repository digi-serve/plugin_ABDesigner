/*
 * ABViewReportsManager
 * A Property manager for our ABViewReportsManager definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_pivot";

   const ABView = FABView(AB);
   const L = ABView.L();

   class ABViewReportManagerProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            dataviewID: "",

            dataviewFieldsLabel: "",
            dataviewFields: "",
            fieldName: "",
            fieldText: "",
            fieldQueries: "",

            datacollectionIDs: "",
            editMode: "",
            hideCommonTab: "",
            hideDataTab: "",
            hideViewTab: "",
         });
      }

      static get key() {
         return "reportsManager";
      }

      ui() {
         const ids = this.ids;
         const uiConfig = AB.UISettings.config();

         return super.ui([
            {
               id: ids.dataviewID,
               name: "dataviewID",
               view: "richselect",
               label: L("Data Source"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.getDataviewFieldOptions(newValue);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.dataviewFieldsLabel,
               view: "label",
               label: L("Dataview Fields"),
               hidden: true,
            },
            {
               id: ids.dataviewFields,
               view: "form",
               hidden: true,
               elements: [
                  {
                     id: ids.fieldName,
                     view: "richselect",
                     name: "name",
                     label: L("Name"),
                     placeholder: L("Single line text"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldText,
                     view: "richselect",
                     name: "text",
                     label: L("Text"),
                     placeholder: L("JSON"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.fieldQueries,
                     view: "richselect",
                     name: "queries",
                     label: L("Queries"),
                     placeholder: L("JSON"),
                     labelWidth: uiConfig.labelWidthLarge,
                  },
               ],
               on: {
                  onChange: (newValue, oldValue) => {
                     if (newValue === oldValue) return;

                     this.onChange();
                  },
               },
            },
            {
               view: "label",
               label: L("Include Datacollections"),
            },
            {
               id: ids.datacollectionIDs,
               view: "multicombo",
               value: [],
               options: [],
               placeholder: L(
                  "Click to add Datacollections (Include all if nothing selected)"
               ),
               labelAlign: "left",
               stringResult: false /* returns data as an array of [id] */,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.editMode,
               name: "editMode",
               view: "checkbox",
               label: L("Edit mode"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.hideCommonTab,
               name: "hideCommonTab",
               view: "checkbox",
               label: L("Hide Common tab"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.hideDataTab,
               name: "hideDataTab",
               view: "checkbox",
               label: L("Hide Data tab"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.hideViewTab,
               name: "hideViewTab",
               view: "checkbox",
               label: L("Hide View tab"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: () => {
                     this.onChange();
                  },
               },
            },
         ]);
      }

      async init(AB) {
         this.AB = AB;

         await super.init(AB);

         const ids = this.ids;
         const datacollections =
            this.CurrentApplication.datacollectionsIncluded();
         const $dataviewID = $$(ids.dataviewID);

         $dataviewID.define(
            "options",
            datacollections.map((dc) => {
               return { id: dc.id, value: dc.label };
            })
         );
         $dataviewID.refresh();

         const $datacollectionIDs = $$(ids.datacollectionIDs);

         $datacollectionIDs.define(
            "options",
            datacollections.map((dc) => {
               return { id: dc.id, value: dc.label };
            })
         );
         $datacollectionIDs.refresh();
      }

      getDataviewFieldOptions(dataviewID) {
         const ids = this.ids;
         const $dataviewFieldsLabel = $$(ids.dataviewFieldsLabel);
         const $dataviewFields = $$(ids.dataviewFields);
         const $fieldName = $$(ids.fieldName);
         const $fielText = $$(ids.fieldText);
         const $fieldQueries = $$(ids.fieldQueries);
         const defaultValues = this.defaultValues();

         if (!dataviewID) {
            $fieldName.define("options", []);
            $fieldName.refresh();
            $dataviewFieldsLabel.hide();
            $dataviewFields.hide();
            $dataviewFields.setValues(defaultValues.dataviewFields);

            return;
         }

         $dataviewFieldsLabel.show();
         $dataviewFields.show();

         const obj = this.AB.datacollectionByID(dataviewID).datasource;

         $fieldName.define(
            "options",
            obj
               .fields((f) => f.key === "string")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldName.refresh();
         $fielText.define(
            "options",
            obj
               .fields((f) => f.key === "json")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fielText.refresh();
         $fieldQueries.define(
            "options",
            obj
               .fields((f) => f.key === "json")
               .map((e) => {
                  return { id: e.id, value: e.label };
               })
         );
         $fieldQueries.refresh();
      }

      populate(view) {
         super.populate(view);

         const ids = this.ids;
         const defaultValues = this.defaultValues();

         Object.keys(view.settings).forEach((key) => {
            const $key = $$(ids[key]);

            switch (key) {
               case "dataviewFields":
                  {
                     const $dataviewFieldsLabel = $$(ids.dataviewFieldsLabel);

                     if (!view.settings.dataviewID) {
                        $key.setValues(defaultValues[key]);
                        $dataviewFieldsLabel.hide();
                        $key.hide();

                        return;
                     }

                     $key.setValues(view.settings[key]);
                     $dataviewFieldsLabel.show();
                     $key.show();
                  }

                  break;

               default:
                  $key.setValue(view.settings[key]);

                  break;
            }
         });
      }

      defaultValues() {
         return this.ViewClass()?.defaultValues() || {};
      }

      /**
       * @method values
       * return the values for this form.
       * @return {obj}
       */
      values() {
         const values = super.values();
         const defaultValues = this.defaultValues();
         const ids = this.ids;

         values.settings = Object.assign(
            {},
            defaultValues,
            $$(ids.component).getValues()
         );

         values.settings.dataviewFields = values.settings.dataviewID
            ? Object.assign(
                 {},
                 defaultValues.$dataviewFields,
                 $$(ids.dataviewFields).getValues()
              )
            : defaultValues.dataviewFields;

         values.settings.datacollectionIDs = $$(
            ids.datacollectionIDs
         ).getValue();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("reportsManager");
      }
   }

   return ABViewReportManagerProperty;
}
