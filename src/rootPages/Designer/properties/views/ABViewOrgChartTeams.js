/*
 * ABViewChartTeams
 * A Property manager for our ABViewChartTeams definitions
 */

import FABView from "./ABView";

export default function (AB) {
   const BASE_ID = "properties_abview_org_chart_teams";

   const ABView = FABView(AB);
   const uiConfig = AB.Config.uiSettings();
   const L = ABView.L();

   class ABViewOrgChartTeamsProperty extends ABView {
      constructor() {
         super(BASE_ID, {
            datacollectionID: "",
            teamInactive: "",
            teamCanInactivate: "",
            teamLink: "",
            teamName: "",
            topTeam: "",
            fields: "",
            direction: "",
            depth: "",
            draggable: "",
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
         return "orgchart_teams";
      }

      ui() {
         const ids = this.ids;

         return super.ui([
            {
               id: ids.datacollectionID,
               name: "datacollectionID",
               view: "richselect",
               label: L("Team Data"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: (value) => {
                     this.CurrentView.settings.datacollectionID = value;
                     const obj = this.CurrentView?.datacollection?.datasource;
                     this.populateTeamFieldOptions(obj);
                     this.onChange();
                  },
               },
            },
            {
               id: ids.teamLink,
               view: "richselect",
               label: L("Team Link"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.teamName,
               view: "richselect",
               label: L("Team Name"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.topTeam,
               view: "richselect",
               label: L("Top Team"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.teamInactive,
               view: "richselect",
               label: L("Team Inactive"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.teamCanInactivate,
               view: "richselect",
               label: L("Can Inactivate"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.draggable,
               name: "draggable",
               view: "checkbox",
               label: L("Drag & Drop"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: { onChange: () => this.onChange() },
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
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.depth,
               name: "depth",
               hidden: true, // NOTE: use choose Connect Fields option
               view: "counter",
               label: L("Depth"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.color,
               name: "color",
               view: "colorpicker",
               label: L("Color"),
               labelWidth: uiConfig.labelWidthLarge,
               on: { onChange: () => this.onChange() },
            },
            {
               hidden: true, // NOTE: does not support
               id: ids.pan,
               name: "pan",
               view: "checkbox",
               label: L("Pan"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: { onChange: () => this.onChange() },
            },
            {
               hidden: true, // NOTE: does not support
               id: ids.zoom,
               name: "zoom",
               view: "checkbox",
               label: L("Zoom"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: { onChange: () => this.onChange() },
            },
            {
               id: ids.height,
               view: "counter",
               name: "height",
               label: L("Height"),
               labelWidth: uiConfig.labelWidthLarge,
               on: { onChange: () => this.onChange() },
            },
            {
               hidden: true, // NOTE: does not support
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

         // const $fieldList = $$(ids.fields);
         // $fieldList.clearAll();
         this.populateDatacollection(values.datacollectionId);
         const teamObj = this.CurrentView?.datacollection?.datasource;
         if (teamObj) {
            this.populateTeamFieldOptions(teamObj);
            $$(this.ids.teamLink).setValue(values.teamLink);
            $$(this.ids.teamName).setValue(values.teamName);
            $$(this.ids.topTeam).setValue(values.topTeam);
         }

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

      populateTeamFieldOptions(object) {
         const view = this.CurrentView;
         const linkFields = view.getValueFields(object).map((f) => {
            return {
               id: f.id,
               value: f.label,
               field: f,
            };
         });
         $$(this.ids.teamLink).define("options", linkFields);

         const textFields = object
            ?.fields((f) => f.key === "string")
            .map((f) => {
               return {
                  id: f.id,
                  value: f.label,
                  field: f,
               };
            });
         $$(this.ids.teamName).define("options", textFields);

         const booleanFields = object
            ?.fields((f) => f.key === "boolean")
            .map((f) => {
               return {
                  id: f.id,
                  value: f.label,
                  field: f,
               };
            });
         // Add an empty option as this is an optional setting.
         booleanFields.unshift({ id: "", value: "", $empty: true });
         $$(this.ids.topTeam).define("options", booleanFields);
         $$(this.ids.teamInactive).define("options", booleanFields);
         $$(this.ids.teamCanInactivate).define("options", booleanFields);
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
         // values.settings = values.setttings ?? {};
         values.settings = Object.assign(
            $$(ids.component).getValues(),
            values.settings
         );
         // Retrive the values of your properties from Webix and store them in the view
         values.settings.teamLink = $$(ids.teamLink).getValue();
         values.settings.teamName = $$(ids.teamName).getValue();
         values.settings.topTeam = $$(ids.topTeam).getValue();
         values.settings.teamInactive = $$(ids.teamInactive).getValue();
         values.settings.teamCanInactivate = $$(ids.teamCanInactivate).getValue();
         values.settings.dataCollectionId = $$(ids.datacollectionID).getValue();

         return values;
      }

      /**
       * @method FieldClass()
       * A method to return the proper ABViewXXX Definition.
       * NOTE: Must be overwritten by the Child Class
       */
      ViewClass() {
         return super._ViewClass("orgchart_teams");
      }
   }

   return ABViewOrgChartTeamsProperty;
}
