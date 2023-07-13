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
            readonly: "",
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
               label: L("Choose Datacollections"),
            },
            {
               id: ids.datacollectionIDs,
               view: "list",
               height: 200,
               select: "multiselect",
               template: "#value#",
               data: [],
               on: {
                  onSelectChange: () => {
                     this.onChange();
                  },
               },
            },
            {
               view: "button",
               label: "Unselect All",
               click: () => {
                  $$(ids.datacollectionIDs).unselectAll();
               },
            },
            {
               id: ids.readonly,
               name: "readonly",
               view: "checkbox",
               label: L("Read only"),
               labelWidth: uiConfig.labelWidthLarge,
               on: {
                  onChange: (newValue) => {
                     const $edieMode = $$(ids.editMode);

                     if (newValue === 1) $edieMode.show();
                     else $edieMode.hide();

                     this.onChange();
                  },
               },
            },
            {
               id: ids.editMode,
               name: "editMode",
               view: "checkbox",
               hidden: true,
               label: L("Edit mode"),
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
         datacollections.forEach((dc) => {
            $$(ids.datacollectionIDs).add({ id: dc.id, value: dc.label });
         });
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
               case "datacollectionIDs":
                  if (view.settings[key] === "") break;

                  $$(ids.datacollectionIDs).select(
                     view.settings.datacollectionIDs.split(", ")
                  );

                  break;

               case "dataviewFields":
                  {
                     const $dataviewFieldsLabel = $$(ids.dataviewFieldsLabel);
                     const $key = $$(ids[key]);

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

               case "editMode":
                  if (view.settings.readonly === 0) {
                     $key.setValue(defaultValues.editMode);

                     break;
                  }

                  $key.setValue(view.settings[key]);

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
            ? $$(ids.dataviewFields).getValues()
            : defaultValues.dataviewFields;

         const selectedIDs = $$(ids.datacollectionIDs).getSelectedId();

         values.settings.datacollectionIDs = Array.isArray(selectedIDs)
            ? selectedIDs.join(", ")
            : selectedIDs;

         if (values.settings.readonly === 0)
            values.settings.editMode = defaultValues.editMode;

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
