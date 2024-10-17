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
            groupByField: "",
            contentField: "",
            contentFieldFilter: "",
            contentFieldFilterButton: "",
            contentGroupByField: "",
            contentDisplayedFields: "",
            contentDisplayedFieldsAdd: "",
         });
         this.AB = AB;
         const contentFieldFilter = (this.contentFieldFilter =
            AB.filterComplexNew(this.ids.contentFieldFilter));
         contentFieldFilter.on("save", () => {
            if (
               !contentFieldFilter.isConditionComplete(
                  contentFieldFilter.getValue()
               )
            )
               contentFieldFilter.setValue({ glue: "and", rules: [] });
            this.onChange();
         });
      }

      static get key() {
         return "orgchart_teams";
      }

      _uiContentDisplayedField(fieldID = "", obj, atDisplay) {
         const self = this;
         const ids = self.ids;
         const datasource = this.CurrentView.datacollection.datasource;
         const datasourceID = datasource.id;
         const parentObj = datasource.fieldByID(
            $$(ids.contentField).getValue()
         ).datasourceLink;
         const parentObjID = parentObj.id;
         const objID = obj?.id || parentObjID;
         const $contentDisplayedFields = $$(ids.contentDisplayedFields);
         const filterFields = (f) => {
            const linkedObjID = f.datasourceLink?.id;
            return linkedObjID !== datasourceID && linkedObjID !== parentObjID;
         };
         const mapFields = (f) => ({
            id: f.id,
            value: f.label,
            field: f,
         });
         const getOnSelectChangeFn =
            (currentObj, currentAtDisplay) => (newValue) => {
               const field = currentObj.fieldByID(newValue);
               if (field.key === "connectObject") {
                  $contentDisplayedFields.addView(
                     this._uiContentDisplayedField(
                        "",
                        field.datasourceLink,
                        currentAtDisplay
                     )
                  );
               }
               this.populateContentDisplayedFields(
                  $contentDisplayedFields.getValues()
               );
               this.onChange();
            };
         if (objID === parentObjID) {
            const rootAtDisplay = Object.keys(
               $contentDisplayedFields.elements
            ).filter((key) => key.includes(objID)).length;
            return {
               cols: [
                  {
                     view: "richselect",
                     name: `${rootAtDisplay}.${parentObjID}`,
                     label: `${L("Display")} ${rootAtDisplay + 1}`,
                     labelWidth: uiConfig.labelWidthMedium,
                     options:
                        parentObj.fields(filterFields).map(mapFields) || [],
                     value: fieldID,
                     on: {
                        onChange: getOnSelectChangeFn(parentObj, rootAtDisplay),
                     },
                  },
                  {
                     view: "button",
                     css: "webix_danger",
                     type: "icon",
                     icon: "wxi-close",
                     width: uiConfig.buttonWidthExtraSmall,
                     click() {
                        self.deleteContentDisplayedField(
                           this.getParentView().getChildViews()[0].config.id
                        );
                        self.onChange();
                     },
                  },
               ],
            };
         }
         return {
            cols: [
               {
                  view: "richselect",
                  name: `${atDisplay}.${objID}`,
                  label: "->",
                  labelWidth: uiConfig.labelWidthMedium,
                  options: obj.fields(filterFields).map(mapFields) || [],
                  value: fieldID,
                  on: {
                     onChange: getOnSelectChangeFn(obj, atDisplay),
                  },
               },
               {
                  view: "button",
                  css: "webix_danger",
                  type: "icon",
                  icon: "wxi-close",
                  width: uiConfig.buttonWidthExtraSmall,
                  click() {
                     self.deleteContentDisplayedField(
                        this.getParentView().getChildViews()[0].config.id
                     );
                     self.onChange();
                  },
               },
            ],
         };
      }

      ui() {
         const ids = this.ids;
         const contentFieldFilter = this.contentFieldFilter;
         contentFieldFilter.myPopup = webix.ui({
            view: "popup",
            height: 240,
            width: 480,
            hidden: true,
            body: contentFieldFilter.ui,
         });
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
               cols: [
                  {
                     view: "label",
                     label: L("Content Field"),
                     width: uiConfig.labelWidthLarge,
                  },
                  {
                     id: ids.contentField,
                     name: "contentField",
                     view: "richselect",
                     options: [],
                     on: {
                        onChange: (newValue) => {
                           const $contentDisplayedFieldsAdd = $$(
                              ids.contentDisplayedFieldsAdd
                           );
                           const $contentFieldFilterButton = $$(
                              ids.contentFieldFilterButton
                           );
                           const $contentGroupByField = $$(
                              ids.contentGroupByField
                           );
                           contentFieldFilter.init();
                           contentFieldFilter.setValue({
                              glue: "and",
                              rules: [],
                           });
                           if (newValue != null && newValue !== "") {
                              const contentObj =
                                 this.CurrentView.datacollection.datasource.fieldByID(
                                    newValue
                                 ).datasourceLink;
                              contentFieldFilter.fieldsLoad(
                                 contentObj.fields()
                              );
                              $contentGroupByField.setValue("");
                              $contentGroupByField.define("options", [
                                 { id: "", value: "", $empty: true },
                                 ...contentObj
                                    .fields(
                                       (f) =>
                                          f.key === "list" &&
                                          f.settings.isMultiple === 0
                                    )
                                    .map((f) => ({
                                       id: f.id,
                                       value: f.label,
                                       field: f,
                                    })),
                              ]);
                              $contentFieldFilterButton.enable();
                              $contentDisplayedFieldsAdd.show();
                              $contentGroupByField.show();
                           } else {
                              contentFieldFilter.fieldsLoad([]);
                              $contentGroupByField.setValue("");
                              $contentGroupByField.define("options", []);
                              $contentFieldFilterButton.disable();
                              $contentDisplayedFieldsAdd.hide();
                              $contentGroupByField.hide();
                           }
                           this.populateContentDisplayedFields({});
                           this.onChange();
                        },
                     },
                  },
                  {
                     id: ids.contentFieldFilterButton,
                     view: "button",
                     type: "icon",
                     icon: "fa fa-filter",
                     css: "webix_primary",
                     disabled: true,
                     width: uiConfig.buttonWidthExtraSmall,
                     click() {
                        contentFieldFilter.popUp(this.$view, null, {
                           pos: "top",
                        });
                     },
                  },
               ],
            },
            {
               id: ids.contentGroupByField,
               hidden: true,
               view: "richselect",
               label: L("Content Group By Field"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: (newValue) => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.contentDisplayedFieldsAdd,
               hidden: true,
               cols: [
                  {
                     view: "label",
                     label: L("Content Displayed Fields"),
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-plus",
                     css: "webix_primary",
                     width: uiConfig.buttonWidthExtraSmall,
                     click: () => {
                        const $contentDisplayedFields = $$(
                           ids.contentDisplayedFields
                        );
                        if (!$contentDisplayedFields.isVisible())
                           $contentDisplayedFields.show();
                        const values = $contentDisplayedFields.getValues();
                        for (const key in values) {
                        }
                        Object.keys($contentDisplayedFields.elements);
                        $contentDisplayedFields.addView(
                           this._uiContentDisplayedField()
                        );
                     },
                  },
               ],
            },
            {
               id: ids.contentDisplayedFields,
               view: "form",
               hidden: true,
               elements: [],
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
         this.contentFieldFilter.queriesLoad(
            this.CurrentApplication?.queriesIncluded()
         );
      }

      deleteContentDisplayedField(id) {
         const ids = this.ids;
         const $contentDisplayedFields = $$(ids.contentDisplayedFields);
         const $elements = $contentDisplayedFields.elements;
         const $richselect = $$(id);
         const deletedElementKey = $richselect.config.name;
         if (
            deletedElementKey.includes(
               this.CurrentView.datacollection.datasource.fieldByID(
                  $$(ids.contentField).getValue()
               ).datasourceLink.id
            )
         ) {
            const deletedAtDisplay = deletedElementKey.split(".")[0];
            for (const key in $elements) {
               if (!key.includes(`${deletedAtDisplay}.`)) continue;
               $contentDisplayedFields.removeView(
                  $elements[key].getParentView().config.id
               );
            }
         } else
            $contentDisplayedFields.removeView(
               $richselect.getParentView().config.id
            );
         this.populateContentDisplayedFields(
            $contentDisplayedFields.getValues()
         );
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
            $$(ids.teamLink).setValue(values.teamLink);
            $$(ids.teamName).setValue(values.teamName);
            $$(ids.teamInactive).setValue(values.teamInactive);
            $$(ids.teamCanInactivate).setValue(values.teamCanInactivate);
            $$(ids.topTeam).setValue(values.topTeam);
            $$(ids.contentField).setValue(values.contentField);
            $$(ids.contentGroupByField).setValue(values.contentGroupByField);
            this.contentFieldFilter.setValue(
               JSON.parse(values.contentFieldFilter)
            );
            this.populateContentDisplayedFields(values.contentDisplayedFields);
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
         const ids = this.ids;
         $$(ids.teamLink).define("options", linkFields);
         const textFields = object
            ?.fields((f) => f.key === "string")
            .map((f) => {
               return {
                  id: f.id,
                  value: f.label,
                  field: f,
               };
            });
         $$(ids.teamName).define("options", textFields);
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
         $$(ids.topTeam).define("options", booleanFields);
         $$(ids.teamInactive).define("options", booleanFields);
         $$(ids.teamCanInactivate).define("options", booleanFields);
         $$(ids.contentField).define("options", [
            { id: "", value: "", $empty: true },
            ...linkFields,
         ]);
      }

      populateContentDisplayedFields(values) {
         const ids = this.ids;
         const $contentDisplayedFields = $$(ids.contentDisplayedFields);
         const elements = $contentDisplayedFields.elements;
         for (const key in elements)
            $contentDisplayedFields.removeView(
               elements[key].getParentView().config.id
            );
         const keys = Object.keys(values);
         if (keys.length === 0) {
            $contentDisplayedFields.hide();
            return;
         }
         const obj = this.CurrentView.datacollection.datasource.fieldByID(
            $$(ids.contentField).getValue()
         ).datasourceLink;
         const objID = obj.id;
         const parentKeys = [];
         const childKeys = [];
         while (keys.length > 0) {
            const key = keys.pop();
            (key.includes(objID) && parentKeys.push(key)) ||
               childKeys.push(key);
         }
         while (parentKeys.length > 0) {
            const parentKey = parentKeys.pop();
            const parentFieldID = values[parentKey] ?? "";
            $contentDisplayedFields.addView(
               this._uiContentDisplayedField(parentFieldID)
            );
            if (
               parentFieldID === "" ||
               obj.fieldByID(parentFieldID).key !== "connectObject"
            )
               continue;
            const currentAtDisplay =
               Object.keys($contentDisplayedFields.getValues()).filter(
                  (currentKey) => currentKey.includes(objID)
               ).length - 1;
            while (
               childKeys.findIndex((childKey) =>
                  childKey.includes(`${parentKey.split(".")[0]}.`)
               ) > -1
            ) {
               const childKey = childKeys.pop();
               const childObj = this.AB.objectByID(childKey.split(".")[1]);
               const childFieldID = values[childKey] ?? "";
               $contentDisplayedFields.addView(
                  this._uiContentDisplayedField(
                     childFieldID,
                     childObj,
                     currentAtDisplay
                  )
               );
               if (
                  childFieldID === "" ||
                  childObj.fieldByID(childFieldID).key !== "connectObject"
               )
                  break;
            }
         }
         $contentDisplayedFields.show();
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
         const settings = (values.settings = Object.assign(
            $$(ids.component).getValues(),
            values.settings
         ));
         // Retrive the values of your properties from Webix and store them in the view
         settings.teamLink = $$(ids.teamLink).getValue();
         settings.teamName = $$(ids.teamName).getValue();
         settings.topTeam = $$(ids.topTeam).getValue();
         settings.teamInactive = $$(ids.teamInactive).getValue();
         settings.teamCanInactivate = $$(ids.teamCanInactivate).getValue();
         settings.dataCollectionId = $$(ids.datacollectionID).getValue();
         settings.contentField = $$(ids.contentField).getValue();
         settings.contentGroupByField = $$(ids.contentGroupByField).getValue();
         settings.contentFieldFilter = JSON.stringify(
            this.contentFieldFilter.getValue()
         );
         settings.contentDisplayedFields = $$(
            ids.contentDisplayedFields
         ).getValues();
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
