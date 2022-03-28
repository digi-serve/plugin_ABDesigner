// const ABComponent = require("../classes/platform/ABComponent");
// const ABPopupSortField = require("./ab_work_object_workspace_popupSortFields");
// const ABViewTab = require("../classes/platform/views/ABViewTab");
// const ABViewDetail = require("../classes/platform/views/ABViewDetail");
// const RowFilter = require("../classes/platform/RowFilter");

import UI_Class from "./ui_class";
import FPopupSortField from "./ui_work_object_workspace_popupSortFields";

export default function (AB) {
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   const uiCustom = AB.custom;
   const L = UIClass.L();

   class UI_Work_Datacollection_Workspace_Properties extends UIClass {
      constructor() {
         super("ui_work_datacollection_workspace_properties", {
            propertyPanel: "",

            dataSource: "",
            linkDatacollection: "",
            linkField: "",
            loadAll: "",
            fixSelect: "",

            filterPanel: "",
            preventPopulate: "",
            sortPanel: "",

            buttonFilter: "",
            buttonSort: "",

            list: "",

            filter: "",
            sort: "",
         });

         this.AB = AB;
         // {ABFactory}

         this.callbacks = {
            onSave: function (/* datacollection */) {
               // Do nothing
            },
         };

         /*
          * _templateListItem
          *
          * The Object Row template definition.
          */
         this._templateListItem = [
            "<div class='ab-page-list-item'>",
            "{common.icon()} <span class='webix_icon fa fa-#typeIcon#'></span> #label# #hasDataCollection#",
            "</div>",
         ].join("");

         this.viewList = null;

         this.FilterComponent = this.AB.rowfilterNew(null, this.ids.filter);
         this.FilterComponent.on("changed", () => {
            this.onFilterChange();
         });

         this.filter_popup = webix.ui({
            view: "popup",
            width: 800,
            hidden: true,
            body: this.FilterComponent.ui,
         });

         this.PopupSortFieldComponent = FPopupSortField(this.AB);
         this.PopupSortFieldComponent.ids = new UIClass(
            "ui_work_datacollection_workspace_popupSortFields",
            {
               list: "",
               form: "",
            }
         ).ids;
         this.PopupSortFieldComponent.on("changed", (sortSettings) => {
            this.onSortChange(sortSettings);
            this.save();
         });
      }

      ui() {
         const ids = this.ids;
         const instance = this;

         return {
            width: uiConfig.columnWidthXLarge,
            rows: [
               {
                  view: "toolbar",
                  css: "ab-data-toolbar webix_dark",
                  cols: [
                     { view: "spacer", width: 10 },
                     {
                        view: "label",
                        label: L("Properties"),
                     },
                  ],
               },
               {
                  view: "scrollview",
                  id: ids.propertyPanel,
                  body: {
                     padding: 15,
                     rows: [
                        {
                           view: "fieldset",
                           label: L("Data Source:"),
                           labelWidth: uiConfig.labelWidthLarge,
                           body: {
                              type: "clean",
                              padding: 10,
                              rows: [
                                 {
                                    id: ids.dataSource,
                                    view: "richselect",
                                    name: "dataSource",
                                    label: L("Source:"),
                                    labelWidth: uiConfig.labelWidthLarge,
                                    options: {
                                       data: [],
                                    },
                                    on: {
                                       onChange: (newv, oldv) => {
                                          if (newv == oldv) return;
                                          this.selectSource(newv, oldv);
                                          this.save();
                                       },
                                    },
                                 },
                                 // link to another data collection
                                 {
                                    id: ids.linkDatacollection,
                                    view: "select",
                                    name: "linkDatacollection",
                                    label: L("Linked To:"),
                                    labelWidth: uiConfig.labelWidthLarge,
                                    options: [],
                                    hidden: 1,
                                    on: {
                                       onChange: (linkedDvId) => {
                                          this.initLinkFieldOptions(linkedDvId);
                                          this.save();
                                       },
                                    },
                                 },
                                 {
                                    id: ids.linkField,
                                    view: "select",
                                    name: "linkField",
                                    label: L("Linked Field:"),
                                    labelWidth: uiConfig.labelWidthLarge,
                                    options: [],
                                    hidden: 1,
                                    on: {
                                       onChange: () => {
                                          this.save();
                                       },
                                    },
                                 },
                              ],
                           },
                        },
                        {
                           view: "fieldset",
                           label: L("Advanced Options:"),
                           labelWidth: uiConfig.labelWidthLarge,
                           body: {
                              type: "clean",
                              padding: 10,
                              rows: [
                                 {
                                    id: ids.filterPanel,
                                    name: "filterPanel",
                                    cols: [
                                       {
                                          view: "label",
                                          label: L("Filter Data:"),
                                          width: uiConfig.labelWidthLarge,
                                       },
                                       {
                                          id: ids.buttonFilter,
                                          css: "webix_primary",
                                          view: "button",
                                          name: "buttonFilter",
                                          label: L("Settings"),
                                          icon: "fa fa-gear",
                                          type: "icon",
                                          badge: 0,
                                          click: function () {
                                             instance.showFilterPopup(
                                                this.$view
                                             );
                                          },
                                       },
                                    ],
                                 },
                                 {
                                    id: ids.sortPanel,
                                    name: "sortPanel",
                                    cols: [
                                       {
                                          view: "label",
                                          label: L("Sort Data:"),
                                          width: uiConfig.labelWidthLarge,
                                       },
                                       {
                                          id: ids.buttonSort,
                                          css: "webix_primary",
                                          view: "button",
                                          name: "buttonSort",
                                          label: L("Settings"),
                                          icon: "fa fa-gear",
                                          type: "icon",
                                          badge: 0,
                                          click: function () {
                                             instance.showSortPopup(this.$view);
                                          },
                                       },
                                    ],
                                 },
                                 {
                                    cols: [
                                       {
                                          view: "label",
                                          label: L("Load all:"),
                                          width: uiConfig.labelWidthLarge,
                                       },
                                       {
                                          id: ids.loadAll,
                                          view: "checkbox",
                                          name: "loadAll",
                                          label: "",
                                          on: {
                                             onChange: () => {
                                                this.save();
                                             },
                                          },
                                       },
                                    ],
                                 },
                                 {
                                    id: ids.preventPopulate,
                                    view: "checkbox",
                                    name: "preventPopulate",
                                    label: L("Do not populate related data:"),
                                    labelWidth: 210,
                                    on: {
                                       onChange: () => {
                                          this.save();
                                       },
                                    },
                                 },
                                 {
                                    id: ids.fixSelect,
                                    view: "select",
                                    name: "fixSelect",
                                    label: L("Select:"),
                                    labelWidth: uiConfig.labelWidthLarge,
                                    options: [],
                                    on: {
                                       onChange: () => {
                                          this.save();
                                       },
                                    },
                                 },
                              ],
                           },
                        },
                        {
                           view: "fieldset",
                           label: L("Data used in..."),
                           labelWidth: uiConfig.labelWidthLarge,
                           body: {
                              view: uiCustom.edittree.view, // "edittree",
                              id: ids.list,
                              select: true,
                              editaction: "custom",
                              editable: true,
                              editor: "text",
                              editValue: "label",
                              borderless: true,
                              padding: 0,
                              css: "ab-tree-ui",
                              minHeight: 300,
                              template: (obj, common) => {
                                 return this.templateListItem(obj, common);
                              },
                              type: {
                                 iconGear:
                                    "<span class='webix_icon fa fa-cog'></span>",
                              },
                              on: {
                                 onAfterSelect: (id) => {
                                    this.onAfterSelect(id);
                                 },
                              },
                           },
                        },
                        {
                           maxHeight: uiConfig.mediumSpacer,
                           height: uiConfig.mediumSpacer,
                           minHeight: uiConfig.mediumSpacer,
                           hidden: uiConfig.hideMobile,
                        },
                     ],
                  },
               },
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         const ids = this.ids;
         // register our callbacks:
         for (const c in this.callbacks) {
            this.callbacks[c] = AB[c] || this.callbacks[c];
         }

         if ($$(ids.list)) {
            webix.extend($$(ids.list), webix.ProgressBar);
            $$(this.ids.list).adjust();
         }

         if ($$(ids.propertyPanel))
            webix.extend($$(ids.propertyPanel), webix.ProgressBar);

         this.initPopupEditors();
      }

      /**
       * @function onAfterSelect()
       *
       * Perform these actions when a View is selected in the List.
       */
      onAfterSelect(id) {
         const view = $$(this.ids.list).getItem(id);
         const viewObj = this.CurrentApplication.views(
            (v) => v.id == view.id
         )[0];

         setTimeout(() => {
            this.AB.actions.tabSwitch("interface");
            this.AB.actions.populateInterfaceWorkspace(viewObj);
         }, 50);
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         const ids = this.ids;

         this.refreshDataSourceOptions();

         this.listBusy();

         // this so it looks right/indented in a tree view:
         this.viewList = new webix.TreeCollection();

         /**
          * @method addPage
          *
          * @param {ABView} page
          * @param {integer} index
          * @param {uuid} parentId
          */
         const addPage = (page, index, parentId) => {
            // add to tree collection
            const branch = {
               id: page.viewId || page.id,
               label: page.label,
               icon: page.icon ? page.icon : "",
               viewIcon: page.viewIcon ? page.viewIcon() : "",
               datacollection: {
                  id: page.datacollection ? page.datacollection.id : "",
               },
            };
            this.viewList.add(branch, index, parentId);

            // // add sub-pages
            // if (page instanceof ABViewDetail) {
            //    return;
            // }

            const subPages = page.pages ? page.pages() : [];
            subPages.forEach((childPage, childIndex) => {
               addPage(childPage, childIndex, page.id);
            });

            // add non-tab components
            subPages
               // .views((v) => !(v instanceof ABViewTab))
               .forEach((widgetView, widgetIndex) => {
                  const wIndex = subPages.length + widgetIndex;
                  addPage(widgetView, wIndex, page.id);
               });

            // add tabs
            subPages
               // .views((v) => v instanceof ABViewTab)
               .forEach((tab, tabIndex) => {
                  // tab views
                  tab.views().forEach((tabView, tabViewIndex) => {
                     // tab items will be below sub-page items
                     const tIndex = subPages.length + tabIndex + tabViewIndex;

                     addPage(tabView, tIndex, page.id);
                  });
               });
         };
         this.CurrentApplication.pages().forEach((p, index) => {
            addPage(p, index);
         });

         // clear our list and display our objects:
         const List = $$(ids.list);

         List.clearAll();
         List.data.unsync();
         List.data.sync(this.viewList);
         List.refresh();
         List.parse(this.viewList);
         List.unselectAll();

         this.listReady();
      }

      datacollectionLoad(datacollection) {
         const ids = this.ids;
         super.datacollectionLoad(datacollection);

         this.CurrentDatacollection = this.AB.datacollectionByID(
            this.CurrentDatacollectionID
         );

         let settings = {};

         if (this.CurrentDatacollection) {
            settings = this.CurrentDatacollection.settings || {};

            this.CurrentDatacollection.removeListener(
               "loadData",
               (rowsData) => {
                  this.populateFixSelector(rowsData);
               }
            );
            this.CurrentDatacollection.on("loadData", (rowsData) => {
               this.populateFixSelector(rowsData);
            });
         }

         // populate link data collection options
         this.initLinkDatacollectionOptions();

         // populate link fields
         this.initLinkFieldOptions(
            this.CurrentDatacollection?.datacollectionLink?.id || null
         );

         // initial populate of popups
         this.populatePopupEditors();

         this.populateBadgeNumber();

         // if selected soruce is a query, then hide advanced options UI
         if (settings.isQuery) {
            $$(ids.filterPanel).hide();
            $$(ids.sortPanel).hide();
         } else {
            $$(ids.filterPanel).show();
            $$(ids.sortPanel).show();
         }

         this.refreshDataSourceOptions();
         $$(ids.dataSource).define("value", settings.datasourceID);
         $$(ids.linkDatacollection).define(
            "value",
            settings.linkDatacollectionID
         );
         $$(ids.linkField).define("value", settings.linkFieldID);
         $$(ids.loadAll).define("value", settings.loadAll);
         $$(ids.fixSelect).define("value", settings.fixSelect);
         $$(ids.preventPopulate).define("value", settings.preventPopulate);

         $$(ids.dataSource).refresh();
         $$(ids.linkDatacollection).refresh();
         $$(ids.linkField).refresh();
         $$(ids.loadAll).refresh();
         $$(ids.preventPopulate).refresh();
         $$(ids.fixSelect).refresh();
         $$(ids.list).openAll();
      }

      refreshDataSourceOptions() {
         if (!this.CurrentApplication) return;

         const ids = this.ids;

         let datasources = [];

         // Objects
         const objects = this.CurrentApplication.objectIDs.map((id) => {
            const obj = this.AB.objectByID(id);

            if (obj)
               return {
                  id: obj.id,
                  value: obj.label,
                  isQuery: false,
                  icon: "fa fa-database",
               };
            else return null;
         });
         datasources = datasources.concat(objects);

         // Queries
         const queries = this.CurrentApplication.queryIDs.map((id) => {
            const qr = this.AB.queryByID(id);

            if (qr)
               return {
                  id: qr.id,
                  value: qr.label,
                  isQuery: true,
                  icon: "fa fa-filter",
                  disabled: qr?.isDisabled(),
               };
            else return null;
         });
         datasources = datasources.concat(queries);

         datasources = datasources.filter((e) => e !== null);

         datasources.unshift({
            id: "",
            value: L("Select a source"),
         });

         $$(ids.dataSource).define("options", {
            body: {
               scheme: {
                  $init: function (obj) {
                     if (obj.disabled) obj.$css = "disabled";
                  },
               },
               data: datasources,
            },
         });

         $$(ids.dataSource).refresh();
      }

      busy() {
         const $propertyPanel = $$(this.ids.propertyPanel);
         if ($propertyPanel && $propertyPanel.showProgress)
            $propertyPanel.showProgress({ type: "icon" });
      }

      ready() {
         const $propertyPanel = $$(this.ids.propertyPanel);
         if ($propertyPanel && $propertyPanel.hideProgress)
            $propertyPanel.hideProgress();
      }

      save() {
         if (!this.CurrentDatacollection) return Promise.resolve(); // TODO: refactor in v2

         this.busy();

         const ids = this.ids;

         this.CurrentDatacollection.settings =
            this.CurrentDatacollection.settings || {};
         this.CurrentDatacollection.settings.datasourceID = $$(
            ids.dataSource
         ).getValue();
         this.CurrentDatacollection.settings.linkDatacollectionID = $$(
            ids.linkDatacollection
         ).getValue();
         this.CurrentDatacollection.settings.linkFieldID = $$(
            ids.linkField
         ).getValue();
         this.CurrentDatacollection.settings.objectWorkspace = {};
         this.CurrentDatacollection.settings.objectWorkspace.filterConditions =
            this.FilterComponent.getValue();
         this.CurrentDatacollection.settings.objectWorkspace.sortFields =
            this.PopupSortFieldComponent.getSettings();
         this.CurrentDatacollection.settings.loadAll = $$(
            ids.loadAll
         ).getValue();
         this.CurrentDatacollection.settings.preventPopulate = $$(
            ids.preventPopulate
         ).getValue();
         this.CurrentDatacollection.settings.fixSelect = $$(
            ids.fixSelect
         ).getValue();

         const selectedDS = $$(ids.dataSource)
            .getPopup()
            .getList()
            .getItem(this.CurrentDatacollection.settings.datasourceID);
         if (selectedDS)
            this.CurrentDatacollection.settings.isQuery = selectedDS.isQuery;
         else this.CurrentDatacollection.settings.isQuery = false;

         return new Promise((resolve, reject) => {
            this.CurrentDatacollection.save()
               .catch((err) => {
                  this.ready();
                  reject(err);
               })
               .then(() => {
                  this.CurrentDatacollection.clearAll();
                  this.emit("save", this.CurrentDatacollection.id);
                  this.ready();
                  this.callbacks.onSave(this.CurrentDatacollection);
                  resolve();
               });
         });
      }

      initLinkDatacollectionOptions() {
         const ids = this.ids;

         // get linked data collection list
         const objSource = this.CurrentDatacollection?.datasource || null;

         if (objSource) {
            const linkFields = objSource.connectFields();
            const linkObjectIds = linkFields.map((f) => f.settings.linkObject);

            const linkDvOptions = [];

            // pull data collections that are link to object
            const linkDCs = this.CurrentApplication.datacollectionIDs
               .filter((id) => {
                  const dc = this.AB.datacollectionByID(id);

                  return linkObjectIds.includes(
                     dc?.settings.datasourceID || null
                  );
               })
               .map((id) => this.AB.datacollectionByID(id));

            if (linkDCs && linkDCs.length > 0) {
               // set data collections to options
               linkDCs.forEach((dc) => {
                  linkDvOptions.push({
                     id: dc.id,
                     value: dc.label,
                  });
               });

               linkDvOptions.unshift({
                  id: "",
                  value: L("Select a link source"),
               });

               $$(ids.linkDatacollection).show();
               $$(ids.linkDatacollection).define("options", linkDvOptions);
               $$(ids.linkDatacollection).define(
                  "value",
                  this.CurrentDatacollection?.settings?.linkDatacollectionID ||
                     ""
               );
               $$(ids.linkDatacollection).refresh();
            } else {
               // hide options
               $$(ids.linkDatacollection).hide();
               $$(ids.linkField).hide();
            }
         } else {
            // hide options
            $$(ids.linkDatacollection).hide();
            $$(ids.linkField).hide();
         }
      }

      initLinkFieldOptions(linkedDvId = null) {
         const ids = this.ids;
         const linkFieldOptions = [];

         // Specify id of linked data view
         const linkDC = linkedDvId
            ? this.AB.datacollectionByID(linkedDvId)
            : null;

         // get fields that link to our ABObject
         if (linkDC) {
            const object = this.CurrentDatacollection.datasource;
            const linkObject = linkDC.datasource;
            const relationFields = object
               .connectFields()
               .filter(
                  (link) => link.settings.linkObject == (linkObject || {}).id
               );

            // pull fields to options
            relationFields.forEach((f) => {
               linkFieldOptions.push({
                  id: f.id,
                  value: f.label,
               });
            });
         }

         if (linkFieldOptions.length > 0) $$(ids.linkField).show();
         else $$(ids.linkField).hide();

         let linkFieldId = linkFieldOptions[0] ? linkFieldOptions[0].id : "";

         if (
            this.CurrentDatacollection &&
            this.CurrentDatacollection.settings
         ) {
            linkFieldId = this.CurrentDatacollection.settings.linkFieldID;
         }

         $$(ids.linkField).define("options", linkFieldOptions);
         $$(ids.linkField).define("value", linkFieldId);
         $$(ids.linkField).refresh();
      }

      populatePopupEditors() {
         if (
            this.CurrentDatacollection &&
            this.CurrentDatacollection.datasource
         ) {
            const datasource = this.CurrentDatacollection.datasource;

            // array of filters to apply to the data table
            let filterConditions = {
               glue: "and",
               rules: [],
            };

            let sortConditions = [];

            if (this.CurrentDatacollection.settings.objectWorkspace) {
               if (
                  this.CurrentDatacollection.settings.objectWorkspace
                     .filterConditions
               )
                  filterConditions =
                     this.CurrentDatacollection.settings.objectWorkspace
                        .filterConditions;

               if (
                  this.CurrentDatacollection.settings.objectWorkspace.sortFields
               )
                  sortConditions =
                     this.CurrentDatacollection.settings.objectWorkspace
                        .sortFields;
            }

            // Populate data to popups
            this.FilterComponent.fieldsLoad(
               datasource ? datasource.fields() : []
            );
            this.FilterComponent.setValue(filterConditions);
            this.CurrentDatacollection.refreshFilterConditions(
               filterConditions
            );

            this.PopupSortFieldComponent.objectLoad(datasource);
            this.PopupSortFieldComponent.setSettings(sortConditions);
         }
      }

      populateBadgeNumber() {
         const ids = this.ids;
         const datacollection = this.CurrentDatacollection;

         if (
            datacollection &&
            datacollection.settings &&
            datacollection.settings.objectWorkspace &&
            datacollection.settings.objectWorkspace.filterConditions &&
            datacollection.settings.objectWorkspace.filterConditions.rules
         ) {
            $$(ids.buttonFilter).define(
               "badge",
               datacollection.settings.objectWorkspace.filterConditions.rules
                  .length || null
            );
            $$(ids.buttonFilter).refresh();
         } else {
            $$(ids.buttonFilter).define("badge", null);
            $$(ids.buttonFilter).refresh();
         }

         if (
            datacollection &&
            datacollection.settings &&
            datacollection.settings.objectWorkspace &&
            datacollection.settings.objectWorkspace.sortFields
         ) {
            $$(ids.buttonSort).define(
               "badge",
               datacollection.settings.objectWorkspace.sortFields.length || null
            );
            $$(ids.buttonSort).refresh();
         } else {
            $$(ids.buttonSort).define("badge", null);
            $$(ids.buttonSort).refresh();
         }
      }

      populateFixSelector(rowsData) {
         const ids = this.ids;

         let fixSelect = "";

         const datasource = this.CurrentDatacollection.datasource;

         const dataItems =
            rowsData?.data?.map((item) => {
               return {
                  id: item.id,
                  value: datasource ? datasource.displayData(item) : "",
               };
            }) || [];

         // Add a current user option to allow select first row that match the current user
         if (datasource) {
            const userFields = datasource.fields((f) => f.key == "user");
            if (userFields.length > 0)
               dataItems.unshift({
                  id: "_CurrentUser",
                  value: L("[Current User]"),
               });

            // Add a first record option to allow select first row
            dataItems.unshift(
               {
                  id: "_FirstRecord",
                  value: L("[First Record]"),
               },
               {
                  id: "_FirstRecordDefault",
                  value: L("[Default to First Record]"),
               }
            );
         }

         dataItems.unshift({
            id: "",
            value: L("Select fix cursor"),
         });

         fixSelect = this.CurrentDatacollection.settings.fixSelect || "";

         $$(ids.fixSelect).define("options", dataItems);
         $$(ids.fixSelect).define("value", fixSelect);
         $$(ids.fixSelect).refresh();
      }

      initPopupEditors() {
         this.FilterComponent.init({
            // when we make a change in the popups we want to make sure we save the new workspace to the properties to do so just fire an onChange event
            onChange: this.onFilterChange,
         });

         this.PopupSortFieldComponent.init(this.AB);
      }

      selectSource(datasourceID, oldId) {
         const ids = this.ids;
         const selectedDatasource = $$(ids.dataSource)
            .getList()
            .getItem(datasourceID);

         if (selectedDatasource && selectedDatasource.disabled) {
            // prevents re-calling onChange from itself
            $$(ids.dataSource).blockEvent();
            $$(ids.dataSource).setValue(oldId || "");
            $$(ids.dataSource).unblockEvent();
         }

         if (!selectedDatasource.isQuery) {
            // populate link data collection options
            this.initLinkDatacollectionOptions();

            // populate link fields
            this.initLinkFieldOptions(
               this.CurrentDatacollection?.datacollectionLink?.id || null
            );

            // re-create filter & sort popups
            this.initPopupEditors();

            // populate filter & sort popups
            this.populatePopupEditors();

            this.populateBadgeNumber();

            // show options
            $$(ids.filterPanel).show();
            $$(ids.sortPanel).show();
         } else {
            // hide options
            $$(ids.filterPanel).hide();
            $$(ids.sortPanel).hide();
         }
      }

      showFilterPopup($button) {
         this.filter_popup.show($button, null, { pos: "top" });
      }

      showSortPopup($button) {
         this.PopupSortFieldComponent.show($button, null, {
            pos: "top",
         });
      }

      onFilterChange() {
         const datacollection = this.CurrentDatacollection;
         if (!datacollection) return;

         const filterValues = this.FilterComponent.getValue();

         datacollection.settings.objectWorkspace.filterConditions =
            filterValues || { glue: "and", rules: [] };

         let allCompconste = true;
         filterValues.rules.forEach((f) => {
            // if all 3 fields are present, we are good.
            if (
               f.key &&
               f.rule &&
               (f.value ||
                  // these rules do not have input value
                  f.rule == "is_current_user" ||
                  f.rule == "is_not_current_user" ||
                  f.rule == "contain_current_user" ||
                  f.rule == "not_contain_current_user" ||
                  f.rule == "same_as_user" ||
                  f.rule == "not_same_as_user" ||
                  f.rule == "less_current" ||
                  f.rule == "greater_current" ||
                  f.rule == "less_or_equal_current" ||
                  f.rule == "greater_or_equal_current" ||
                  f.rule == "is_empty" ||
                  f.rule == "is_not_empty")
            ) {
               allCompconste = allCompconste && true;
            } else {
               // else, we found an entry that wasn't compconste:
               allCompconste = false;
            }
         });

         // only perform the update if a compconste row is specified:
         if (allCompconste) {
            // we want to call .save() but give webix a chance to properly update it's
            // select boxes before this call causes them to be removed:
            setTimeout(() => {
               this.save();
            }, 10);
         }
      }

      onSortChange(sortSettings) {
         const datacollection = this.CurrentDatacollection;
         if (!datacollection) return;

         datacollection.settings = datacollection.settings || {};
         datacollection.settings.objectWorkspace =
            datacollection.settings.objectWorkspace || {};
         // store sort settings
         datacollection.settings.objectWorkspace.sortFields =
            sortSettings || [];

         this.populateBadgeNumber();
      }

      /**
       * @function templateListItem
       *
       * Defines the template for each row of our ObjectList.
       *
       * @param {obj} obj the current instance of ABObject for the row.
       * @param {?} common the webix.common icon data structure
       * @return {string}
       */
      templateListItem(item, common) {
         let template = this._templateListItem;

         let hasDataCollection = "";
         if (
            item.datacollection &&
            this.CurrentDatacollection &&
            this.CurrentDatacollection.id &&
            item.datacollection.id == this.CurrentDatacollection.id
         ) {
            hasDataCollection =
               "<i class='webix_icon hasDataCollection fa fa-check-circle'></i>";
         }

         template = template
            .replace("#typeIcon#", item.icon || item.viewIcon())
            .replace("#label#", item.label)
            .replace("{common.icon()}", common.icon(item))
            .replace("#hasDataCollection#", hasDataCollection);

         return template;
      }

      listBusy() {
         const ids = this.ids;

         if ($$(ids.list) && $$(ids.list).showProgress)
            $$(ids.list).showProgress({ type: "icon" });
      }

      listReady() {
         const ids = this.ids;

         if ($$(ids.list) && $$(ids.list).hideProgress)
            $$(ids.list).hideProgress();
      }
   }

   return new UI_Work_Datacollection_Workspace_Properties();
}
