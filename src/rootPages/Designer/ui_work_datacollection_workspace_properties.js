import UI_Class from "./ui_class";
import FPopupSortField from "./ui_work_object_workspace_popupSortFields";
// import ... form "ui_work_interface...";

export default function (AB) {
   const ibase = "ui_work_datacollection_workspace_properties";
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   const uiCustom = AB.custom;
   const L = UIClass.L();

   // const Interface = ...

   class UI_Work_Datacollection_Workspace_Properties extends UIClass {
      constructor() {
         super(ibase, {
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

         this._handler_loadData = (rowsData) => {
            this.populateFixSelector(rowsData);
         };

         this.viewList = null;
         this.FilterComponent = this.AB.filterComplexNew(this.ids.filter);
         this.PopupSortFieldComponent = FPopupSortField(AB, ibase);
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

      async init(AB) {
         this.AB = AB;

         const ids = this.ids;

         const $list = $$(ids.list);
         const $propertyPanel = $$(ids.propertyPanel);

         if ($list) {
            webix.extend($list, webix.ProgressBar);
            $list.adjust();
         }

         if ($propertyPanel) webix.extend($propertyPanel, webix.ProgressBar);

         this.initPopupEditors();

         this.FilterComponent.myPopup = webix.ui({
            view: "popup",
            height: 240,
            width: 480,
            hidden: true,
            body: this.FilterComponent.ui,
         });

         this.FilterComponent.on("save", () => {
            this.onFilterChange();
            this.save();
         });

         this.PopupSortFieldComponent.on("changed", (sortSettings) => {
            this.onSortChange(sortSettings);
            this.save();
         });

         // Interface.on("interface", (viewObj) => {
         //    this.switchTab(viewObj)
         // });
      }

      /**
       * @function onAfterSelect()
       *
       * Perform these actions when a View is selected in the List.
       */
      onAfterSelect(id) {
         const ids = this.ids;
         const view = $$(ids.list).getItem(id);
         const viewObj = this.CurrentApplication.views(
            (v) => v.id == view.id
         )[0];

         setTimeout(() => {
            this.emit("interface", viewObj);
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
         const $list = $$(ids.list);

         $list.clearAll();
         $list.data.unsync();
         $list.data.sync(this.viewList);
         $list.refresh();
         $list.parse(this.viewList);
         $list.unselectAll();

         this.listReady();
      }

      datacollectionLoad(datacollection) {
         const ids = this.ids;
         super.datacollectionLoad(datacollection);

         let settings = {};

         const $filterPanel = $$(ids.filterPanel);
         const $sortPanel = $$(ids.sortPanel);
         const $dataSource = $$(ids.dataSource);
         const $linkDatacollection = $$(ids.linkDatacollection);
         const $linkField = $$(ids.linkField);
         const $loadAll = $$(ids.loadAll);
         const $fixSelect = $$(ids.fixSelect);
         const $preventPopulate = $$(ids.preventPopulate);
         const $list = $$(ids.list);

         if (this.CurrentDatacollection) {
            settings = this.CurrentDatacollection.settings || {};

            this.CurrentDatacollection.removeListener(
               "loadData",
               this._handler_loadData
            );
            this.CurrentDatacollection.on("loadData", this._handler_loadData);
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
            $filterPanel.hide();
            $sortPanel.hide();
         } else {
            $filterPanel.show();
            $sortPanel.show();
         }

         this.refreshDataSourceOptions();
         $dataSource.define("value", settings.datasourceID);
         $linkDatacollection.define("value", settings.linkDatacollectionID);
         $linkField.define("value", settings.linkFieldID);
         $loadAll.define("value", settings.loadAll);
         $fixSelect.define("value", settings.fixSelect);
         $preventPopulate.define("value", settings.preventPopulate);

         $dataSource.refresh();
         $linkDatacollection.refresh();
         $linkField.refresh();
         $loadAll.refresh();
         $fixSelect.refresh();
         $preventPopulate.refresh();
         $list.openAll();
      }

      refreshDataSourceOptions() {
         if (!this.CurrentApplication) return;

         const ids = this.ids;

         let datasources = [];

         // Objects
         const objects = this.CurrentApplication.objectsIncluded().map(
            (obj) => {
               if (obj)
                  return {
                     id: obj.id,
                     value: obj.label,
                     isQuery: false,
                     icon: "fa fa-database",
                  };
               else return null;
            }
         );
         datasources = datasources.concat(objects);

         // Queries
         const queries = this.CurrentApplication.queriesIncluded().map((qr) => {
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
         const ids = this.ids;

         const $propertyPanel = $$(ids.propertyPanel);

         if ($propertyPanel?.showProgress)
            $propertyPanel.showProgress({ type: "icon" });
      }

      ready() {
         const ids = this.ids;

         const $propertyPanel = $$(ids.propertyPanel);

         if ($propertyPanel?.hideProgress) $propertyPanel.hideProgress();
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
               .then(() => {
                  this.CurrentDatacollection.clearAll();
                  this.ready();
                  this.emit("save", this.CurrentDatacollection);
                  resolve();
               })
               .catch((err) => {
                  this.ready();
                  reject(err);
               });
         });
      }

      initLinkDatacollectionOptions() {
         const ids = this.ids;

         // get linked data collection list
         const objSource = this.CurrentDatacollection?.datasource || null;

         const $linkDatacollection = $$(ids.linkDatacollection);
         const $linkField = $$(ids.linkField);

         if (objSource) {
            const linkFields = objSource.connectFields();
            const linkObjectIds = linkFields.map((f) => f.settings.linkObject);

            const linkDvOptions = [];

            // pull data collections that are link to object
            const linkDCs =
               this.CurrentApplication.datacollectionsIncluded().filter((dc) =>
                  linkObjectIds.includes(dc?.settings.datasourceID)
               );

            if (linkDCs?.length > 0) {
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

               $linkDatacollection.show();
               $linkDatacollection.define("options", linkDvOptions);
               $linkDatacollection.define(
                  "value",
                  this.CurrentDatacollection?.settings?.linkDatacollectionID ||
                     ""
               );
               $linkDatacollection.refresh();
            } else {
               // hide options
               $linkDatacollection.hide();
               $linkField.hide();
            }
         } else {
            // hide options
            $linkDatacollection.hide();
            $linkField.hide();
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

         const $linkField = $$(ids.linkField);

         if (linkFieldOptions.length > 0) $linkField.show();
         else $linkField.hide();

         let linkFieldId = linkFieldOptions[0] ? linkFieldOptions[0].id : "";

         if (this.CurrentDatacollection?.settings) {
            linkFieldId = this.CurrentDatacollection.settings.linkFieldID;
         }

         $linkField.define("options", linkFieldOptions);
         $linkField.define("value", linkFieldId);
         $linkField.refresh();
      }

      populatePopupEditors() {
         const datacollection = this.CurrentDatacollection || null;
         const datasource = datacollection?.datasource || null;

         if (datasource) {
            // array of filters to apply to the data table
            const filterConditions = datacollection?.settings?.objectWorkspace
               ?.filterConditions || { glue: "and", rules: [] };

            const sortConditions =
               datacollection?.settings?.objectWorkspace?.sortFields || [];

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

         const $buttonFilter = $$(ids.buttonFilter);
         const $buttonSort = $$(ids.buttonSort);

         if (
            datacollection?.settings?.objectWorkspace?.filterConditions?.rules
         ) {
            $buttonFilter.define(
               "badge",
               datacollection.settings.objectWorkspace.filterConditions.rules
                  ?.length || null
            );
            $buttonFilter.refresh();
         } else {
            $buttonFilter.define("badge", null);
            $buttonFilter.refresh();
         }

         if (datacollection?.settings?.objectWorkspace?.sortFields) {
            $buttonSort.define(
               "badge",
               datacollection.settings.objectWorkspace.sortFields.length || null
            );
            $buttonSort.refresh();
         } else {
            $buttonSort.define("badge", null);
            $buttonSort.refresh();
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
                  value: L("Current User"),
               });

            // Add a first record option to allow select first row
            dataItems.unshift(
               {
                  id: "_FirstRecord",
                  value: L("First Record"),
               },
               {
                  id: "_FirstRecordDefault",
                  value: L("Default to First Record"),
               }
            );
         }

         dataItems.unshift({
            id: "",
            value: L("Select fix cursor"),
         });

         fixSelect = this.CurrentDatacollection.settings.fixSelect || "";

         const $fixSelect = $$(ids.fixSelect);

         $fixSelect.define("options", dataItems);
         $fixSelect.define("value", fixSelect);
         $fixSelect.refresh();
      }

      initPopupEditors() {
         this.FilterComponent.init();
         this.PopupSortFieldComponent.init(this.AB);
      }

      selectSource(datasourceID, oldId) {
         const ids = this.ids;
         const selectedDatasource = $$(ids.dataSource)
            .getList()
            .getItem(datasourceID);

         const $dataSource = $$(ids.dataSource);

         if (selectedDatasource?.disabled) {
            // prevents re-calling onChange from itself
            $dataSource.blockEvent();
            $dataSource.setValue(oldId || "");
            $dataSource.unblockEvent();
         }

         // Set settings.datasourceID
         const dcSettings = this.CurrentDatacollection.toObj() || {};
         dcSettings.settings = dcSettings.settings || {};
         dcSettings.settings.datasourceID = datasourceID;
         this.CurrentDatacollection.fromValues(dcSettings);

         const $filterPanel = $$(ids.filterPanel);
         const $sortPanel = $$(ids.sortPanel);

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
            $filterPanel.show();
            $sortPanel.show();
         } else {
            // hide options
            $filterPanel.hide();
            $sortPanel.hide();
         }
      }

      showFilterPopup($button) {
         this.FilterComponent.popUp($button, null, { pos: "top" });
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
         const isComplete =
            this.FilterComponent.isConditionComplete(filterValues);

         // only perform the update if a complete row is specified:
         if (!isComplete)
            this.FilterComponent.setValue({ glue: "and", rules: [] });

         this.populateBadgeNumber();
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

      switchTab(viewObj) {
         // Interface.populateWorkspace(viewObj);
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
            this.CurrentDatacollection?.id &&
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

         const $list = $$(ids.list);

         if ($list?.showProgress) $list.showProgress({ type: "icon" });
      }

      listReady() {
         const ids = this.ids;

         const $list = $$(ids.list);

         if ($list?.hideProgress) $list.hideProgress();
      }
   }

   return new UI_Work_Datacollection_Workspace_Properties();
}
