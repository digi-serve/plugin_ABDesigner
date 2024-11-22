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
            strategyCode: "",
            teamInactive: "",
            teamCanInactivate: "",
            teamLink: "",
            teamName: "",
            teamStrategy: "",
            topTeam: "",
            fields: "",
            direction: "",
            depth: "",
            draggable: "",
            dropContentToCreate: "",
            color: "",
            pan: "",
            zoom: "",
            height: "",
            export: "",
            exportFilename: "",
            groupByField: "",
            showGroupTitle: "",
            editContentFieldsToCreateNew: "",
            contentField: "",
            contentFieldFilter: "",
            contentFieldFilterButton: "",
            contentGroupByField: "",
            contentDisplayedFields: "",
            contentDisplayedFieldsAdd: "",
            showDataPanel: "",
            dataPanelDCs: "",
            dataPanelDCsAdd: "",
            strategyColorPopup: "",
            strategyColorForm: "",
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

      _uiDataPanelDC(labelValue = "", dcID = "") {
         const self = this;
         const ids = self.ids;
         const $dataPanelDCs = $$(ids.dataPanelDCs);
         const validOBJIDs = this.CurrentView.datacollection.datasource
            .fieldByID($$(ids.contentField).getValue())
            .datasourceLink.connectFields(
               (connectField) => connectField.linkType() === "one"
            )
            .map((connectField) => connectField.datasourceLink.id);
         const dcs = this.AB.datacollections(
            (dc) => validOBJIDs.indexOf(dc.datasource.id) > -1
         );
         const dcOptions = dcs.map((dc) => ({
            id: dc.id,
            value: dc.label,
            dc,
         }));
         const getUILabel = (dcID, elementIndex) => ({
            view: "text",
            name: `${elementIndex}.${dcID}`,
            // label: L("Name"),
            // labelWidth: uiConfig.labelWidthMedium,
            on: {
               onChange: () => {
                  this.onChange();
               },
               onViewShow() {
                  this.setValue(labelValue);
               },
            },
         });
         return {
            cols: [
               {
                  view: "richselect",
                  label: `${L("Panel")} ${
                     $dataPanelDCs.getChildViews().length + 1
                  }`,
                  labelWidth: uiConfig.labelWidthMedium,
                  options: dcOptions,
                  on: {
                     onChange(newValue) {
                        const $parentView = this.getParentView();
                        const sameLevelViews = $parentView.getChildViews();
                        if ($parentView.getChildViews().length === 3)
                           $parentView.removeView(sameLevelViews[1].config.id);
                        $parentView.addView(
                           getUILabel(
                              newValue,
                              $dataPanelDCs
                                 .getChildViews()
                                 .findIndex(
                                    ($dataPanelDCsChild) =>
                                       $dataPanelDCsChild === $parentView
                                 )
                           ),
                           1
                        );
                     },
                     onViewShow() {
                        if (dcID == null || dcID === "") return;
                        this.setValue(dcID);
                     },
                  },
               },
               {
                  view: "button",
                  css: "webix_danger",
                  type: "icon",
                  icon: "wxi-close",
                  width: uiConfig.buttonWidthExtraSmall,
                  click() {
                     self.deleteDataPanelDC(this.getParentView().config.id);
                     self.onChange();
                  },
               },
            ],
         };
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
                        parentObj.fields(filterFields).map(fieldToOption) || [],
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
                  options: obj.fields(filterFields).map(fieldToOption) || [],
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
                           const $editContentFieldsToCreateNew = $$(
                              ids.editContentFieldsToCreateNew
                           );
                           const $contentDisplayedFieldsAdd = $$(
                              ids.contentDisplayedFieldsAdd
                           );
                           const $contentFieldFilterButton = $$(
                              ids.contentFieldFilterButton
                           );
                           const $contentGroupByField = $$(
                              ids.contentGroupByField
                           );
                           const $showGroupTitle = $$(ids.showGroupTitle);
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
                              const contentObjFields = contentObj.fields();
                              $editContentFieldsToCreateNew.define(
                                 "options",
                                 contentObjFields.map(fieldToOption)
                              );
                              contentFieldFilter.fieldsLoad(contentObjFields);
                              $contentGroupByField.define("options", [
                                 { id: "", value: "", $empty: true },
                                 ...contentObjFields
                                    .filter(
                                       (f) => f.key === "connectObject" //&&
                                       // f.settings.isMultiple === 0
                                    )
                                    .map(fieldToOption),
                              ]);
                              $editContentFieldsToCreateNew.enable();
                              $contentFieldFilterButton.enable();
                              $contentDisplayedFieldsAdd.show();
                              $contentGroupByField.show();
                              $showGroupTitle.show();
                           } else {
                              $editContentFieldsToCreateNew.define(
                                 "options",
                                 []
                              );
                              contentFieldFilter.fieldsLoad([]);
                              $contentGroupByField.define("options", []);
                              $editContentFieldsToCreateNew.enable();
                              $contentFieldFilterButton.disable();
                              $contentDisplayedFieldsAdd.hide();
                              $contentGroupByField.hide();
                              $showGroupTitle.hide();
                           }
                           $editContentFieldsToCreateNew.setValue([]);
                           $showGroupTitle.setValue(0);
                           $contentGroupByField.setValue("");
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
                  onChange: (/*newValue*/) => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.showGroupTitle,
               hidden: true,
               name: "showGroupTitle",
               view: "checkbox",
               label: L("Show Group Title"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: (/*newValue*/) => {
                     this.onChange();
                  },
               },
            },
            {
               id: ids.editContentFieldsToCreateNew,
               view: "multicombo",
               value: [],
               options: [],
               placeholder: L("Choose content fields to create new by editing"),
               labelAlign: "left",
               stringResult: false /* returns data as an array of [id] */,
               on: {
                  onChange: (/*newValue*/) => {
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
               id: ids.showDataPanel,
               name: "showDataPanel",
               view: "checkbox",
               label: L("Show Data Panel"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: (newValue) => {
                     const $dataPanelDCsAdd = $$(ids.dataPanelDCsAdd);
                     if (newValue === 1) $dataPanelDCsAdd.show();
                     else $dataPanelDCsAdd.hide();
                     this.populateDataPanelDCs({});
                     this.onChange();
                  },
               },
            },
            {
               id: ids.dataPanelDCsAdd,
               hidden: true,
               cols: [
                  {
                     view: "label",
                     label: L("Data Panel DCs"),
                  },
                  {
                     view: "button",
                     type: "icon",
                     icon: "fa fa-plus",
                     css: "webix_primary",
                     width: uiConfig.buttonWidthExtraSmall,
                     click: () => {
                        const $dataPanelDCs = $$(ids.dataPanelDCs);
                        if (!$dataPanelDCs.isVisible()) $dataPanelDCs.show();
                        $dataPanelDCs.addView(this._uiDataPanelDC());
                     },
                  },
               ],
            },
            {
               id: ids.dataPanelDCs,
               view: "form",
               hidden: true,
               elements: [],
            },
            {
               id: ids.teamStrategy,
               view: "richselect",
               label: L("Strategy"),
               labelWidth: uiConfig.labelWidthLarge,
               options: [],
               on: {
                  onChange: (value) => {
                     this.populateStrategyOptions(value);
                     this.onChange();
                  },
               },
            },
            {
               cols: [
                  {
                     id: ids.strategyCode,
                     view: "richselect",
                     label: L("Strategy Code"),
                     labelWidth: uiConfig.labelWidthLarge,
                     options: [],
                     on: {
                        onChange: () => {
                           this.onChange();
                           $$(this.ids.strategyColorPopup)?.close();
                        },
                     },
                  },
                  {
                     view: "icon",
                     icon: "fa fa-paint-brush",
                     allign: "right",
                     click: () => this.strategyColorPopup(),
                  },
               ],
            },
            {
               id: ids.draggable,
               name: "draggable",
               view: "checkbox",
               label: L("Drag & Drop"),
               labelWidth: uiConfig.labelWidthLarge,
               value: 0,
               on: {
                  onChange: (newValue) => {
                     const $dropContentToCreate = $$(ids.dropContentToCreate);
                     if (newValue === 0) {
                        $dropContentToCreate.setValue(0);
                        $dropContentToCreate.hide();
                     } else $dropContentToCreate.show();
                     this.onChange();
                  },
               },
            },
            {
               id: ids.dropContentToCreate,
               name: "dropContentToCreate",
               view: "checkbox",
               label: L("Drop content to create"),
               labelWidth: uiConfig.labelWidthLarge,
               hidden: true,
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

      deleteDataPanelDC(id) {
         const $dataPanelDCs = $$(this.ids.dataPanelDCs);
         $dataPanelDCs.removeView(id);
         this.populateDataPanelDCs($dataPanelDCs.getValues());
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
            [
               "teamCanInactivate",
               "teamInactive",
               "teamLink",
               "teamName",
               "teamStrategy",
               "topTeam",
               "contentField",
               "contentGroupByField",
               "editContentFieldsToCreateNew",
               "showGroupTitle",
               "showDataPanel",
            ].forEach((f) => $$(ids[f]).setValue(values[f]));
            this.contentFieldFilter.setValue(
               JSON.parse(values.contentFieldFilter)
            );
            this.populateContentDisplayedFields(values.contentDisplayedFields);
            this.populateDataPanelDCs(values.dataPanelDCs);
            if (values.teamStrategy) {
               this.populateStrategyOptions(values.teamStrategy);
               $$(ids.strategyCode).setValue(values.strategyCode);
            }
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
         const ids = this.ids;
         const m2oFields = view.getValueFields(object).map(fieldToOption);
         const o2mFields =
            object.connectFields(
               (f) => f.linkType() == "one" && f.linkViaType() == "many"
            ) ?? [];
         $$(ids.teamStrategy).define("options", o2mFields.map(fieldToOption));
         $$(ids.teamLink).define("options", m2oFields);
         const textFields = object
            ?.fields((f) => f.key === "string")
            .map(fieldToOption);
         $$(ids.teamName).define("options", textFields);
         const booleanFields = object
            ?.fields((f) => f.key === "boolean")
            .map(fieldToOption);

         // Add an empty option as this is an optional setting.
         booleanFields.unshift({ id: "", value: "", $empty: true });
         $$(ids.topTeam).define("options", booleanFields);
         $$(ids.teamInactive).define("options", booleanFields);
         $$(ids.teamCanInactivate).define("options", booleanFields);
         $$(ids.contentField).define("options", [
            { id: "", value: "", $empty: true },
            ...m2oFields,
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
         const obj = this.CurrentView.datacollection.datasource.fieldByID(
            $$(ids.contentField).getValue()
         )?.datasourceLink;
         if (keys.length === 0) {
            $contentDisplayedFields.hide();
            return;
         }
         if (obj == null) {
            $contentDisplayedFields.hide();
            $$(ids.contentDisplayedFieldsAdd).hide();
            return;
         }
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

      populateDataPanelDCs(values) {
         const ids = this.ids;
         const $dataPanelDCs = $$(ids.dataPanelDCs);
         const dataPanelDCsChidren = $dataPanelDCs.getChildViews();
         while (dataPanelDCsChidren.length > 0)
            $dataPanelDCs.removeView(dataPanelDCsChidren[0].config.id);
         $dataPanelDCs.hide();
         const contentFieldValue = $$(ids.contentField).getValue();
         const keys = Object.keys(values);
         if (
            contentFieldValue == null ||
            contentFieldValue === "" ||
            keys.length === 0
         )
            return;
         while (keys.length > 0) {
            const key = keys.shift();
            $dataPanelDCs.addView(
               this._uiDataPanelDC(values[key] ?? "", key.split(".")[1] ?? "")
            );
         }
         $dataPanelDCs.show();
      }

      populateStrategyOptions(fieldID) {
         const strategyObj = this.AB.objectByID(
            this.AB.definitionByID(fieldID).settings.linkObject
         );
         const listFields = strategyObj
            .fields((f) => f.key === "connectObject")
            .map(fieldToOption);
         $$(this.ids.strategyCode).define("options", listFields);
      }

      async strategyColorPopup() {
         const codeFieldID = $$(this.ids.strategyCode).getValue();
         if (!codeFieldID) return;

         let $popup = $$(this.ids.strategyColorPopup);

         if (!$popup) {
            const values = this.CurrentView.settings.strategyColors ?? {};
            const link =
               this.AB.definitionByID(codeFieldID).settings.linkObject;
            const strategies = await this.AB.objectByID(link).model().findAll();
            const strategyTypes = strategies.data.map((strategy) => {
               return {
                  view: "colorpicker",
                  label: strategy.name,
                  name: strategy.id,
                  value: values[strategy.id] ?? "#111111",
               };
            });

            $popup = this.AB.Webix.ui({
               view: "window",
               id: this.ids.strategyColorPopup,
               close: true,
               title: L("Set Colors"),
               position: "center",
               body: {
                  view: "form",
                  id: this.ids.strategyColorForm,
                  elements: [
                     ...strategyTypes,
                     {
                        view: "button",
                        label: L("Apply"),
                        click: () => {
                           this.onChange();
                           $$(this.ids.strategyColorPopup).hide();
                        },
                     },
                  ],
               },
            });
         }
         $popup.show();
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
         settings.teamStrategy = $$(ids.teamStrategy).getValue();
         settings.strategyCode = $$(ids.strategyCode).getValue();
         settings.dataCollectionId = $$(ids.datacollectionID).getValue();
         settings.contentField = $$(ids.contentField).getValue();
         settings.contentGroupByField = $$(ids.contentGroupByField).getValue();
         settings.editContentFieldsToCreateNew = $$(
            ids.editContentFieldsToCreateNew
         ).getValue();
         settings.contentFieldFilter = JSON.stringify(
            this.contentFieldFilter.getValue()
         );
         settings.contentDisplayedFields = $$(
            ids.contentDisplayedFields
         ).getValues();
         settings.dataPanelDCs = $$(ids.dataPanelDCs).getValues();
         const $colorForm = $$(ids.strategyColorForm);
         settings.strategyColors = $colorForm?.getValues() ?? {};
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

function fieldToOption(f) {
   return {
      id: f.id,
      value: f.label,
      field: f,
   };
}
