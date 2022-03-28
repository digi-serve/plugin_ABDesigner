/*
 * ui_work_object_workspace
 *
 * Manage the Object Workspace area.
 */
import UI_Class from "./ui_class";
// const ABWorkspaceGantt = require("./ab_work_object_workspace_gantt");

// const ABWorkspaceIndex = require("./ab_work_object_workspace_index");

// const ABPopupFilterDataTable = require("./ab_work_object_workspace_popupFilterDataTable");

import FPopupCustomIndex from "./ui_work_object_workspace_popupCustomIndex";
import FPopupDefineLabel from "./ui_work_object_workspace_popupDefineLabel";
import FPopupExport from "./ui_work_object_workspace_popupExport";
import FPopupFrozenColumns from "./ui_work_object_workspace_popupFrozenColumns";
import FPopupHeaderEditMenu from "./ui_work_object_workspace_popupHeaderEditMenu";
import FPopupHideFields from "./ui_work_object_workspace_popupHideFields";
import FPopupImport from "./ui_work_object_workspace_popupImport";
import FPopupNewDataField from "./ui_work_object_workspace_popupNewDataField";
import FPopupSortField from "./ui_work_object_workspace_popupSortFields";
import FPopupViewSettings from "./ui_work_object_workspace_popupViewSettings";

import FWorkspaceViews from "./ui_work_object_workspace_workspaceviews";

import FWorkspaceDatatable from "./ui_work_object_workspace_view_grid";
import FWorkspaceGantt from "./ui_work_object_workspace_view_gantt";
import FWorkspaceKanban from "./ui_work_object_workspace_view_kanban";

import FWorkspaceTrack from "./ui_work_object_workspace_popupTrack";

export default function (AB, ibase, init_settings) {
   ibase = ibase || "abd_work_object_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   var Datatable = FWorkspaceDatatable(AB, `${ibase}_view_grid`, init_settings);
   var Gantt = FWorkspaceGantt(AB, `${ibase}_view_gantt`);
   var Kanban = FWorkspaceKanban(AB, `${ibase}_view_kanban`);

   var Track = FWorkspaceTrack(AB, `${ibase}_track`);

   class UIWorkObjectWorkspace extends UIClass {
      /**
       * @param {object} App
       * @param {string} idBase
       * @param {object} settings - {
       * 								allowDelete: bool,
       * 								detailsView: string,
       * 								editView: string,
       * 								isInsertable: bool,
       * 								isEditable: bool,
       * 								massUpdate: bool,
       * 								configureHeaders: bool,
       *
       * 								isFieldAddable: bool
       * 							}
       */
      constructor(base, settings = {}) {
         super(base, {
            // component: `${base}_component`,

            buttonAddField: "",
            buttonDeleteSelected: "",
            buttonDeleteSelectedSpacer: "",
            buttonExport: "",
            buttonImport: "",
            buttonFieldsVisible: "",
            buttonFieldsVisibleSpacer: "",
            buttonFilter: "",
            buttonFrozen: "",
            buttonFrozenSpacer: "",
            buttonLabel: "",
            buttonMassUpdate: "",
            buttonMassUpdateSpacer: "",
            buttonRowNew: "",
            buttonSort: "",
            buttonSortSpacer: "",

            listIndex: "",
            buttonIndex: "",

            datatable: "",
            error: "",
            error_msg: "",

            viewMenu: "",
            viewMenuButton: "",
            viewMenuNewView: "",

            // Toolbar:
            toolbar: "",

            noSelection: "",
            selectedObject: "",
         });

         // default settings
         // settings.trackView = settings.trackView ?? true;
         // settings.allowDelete = settings.allowDelete ?? true;
         // settings.isInsertable = settings.isInsertable ?? true;
         // settings.isEditable = settings.isEditable ?? true;
         // settings.massUpdate = settings.massUpdate ?? true;
         // settings.configureHeaders = settings.configureHeaders ?? true;
         settings.isReadOnly = settings.isReadOnly ?? false;
         // settings.isLabelEditable = settings.isLabelEditable ?? true;
         // settings.isFieldAddable = settings.isFieldAddable ?? true;
         this.settings = settings;

         this.workspaceViews = FWorkspaceViews(AB, `${base}_views`, {
            isReadOnly: this.settings.isReadOnly,
         });

         this.hashViews = {};
         // {hash}  { view.id : webix_component }
         // a hash of the live workspace view components

         // The Grid that displays our object:
         this.hashViews["grid"] = Datatable;
         Datatable.on("column.header.clicked", (node, EditField) => {
            this.PopupHeaderEditMenu.show(node, EditField);
         });
         Datatable.on("object.track", (currentObject, id) => {
            Track.open(currentObject, id);
         });
         Datatable.on("selection", () => {
            this.callbackCheckboxChecked("enable");
         });
         Datatable.on("selection.cleared", () => {
            this.callbackCheckboxChecked("disable");
         });
         Datatable.on("column.order", (fieldOrder) => {
            // fieldOrder : {array} the ABField.ids of the fields in the
            //              order they are displayed.
            var object = this.CurrentObject;
            var newOrder = [];
            fieldOrder.forEach((fid) => {
               newOrder.push(object.fieldByID(fid));
            });
            object._fields = newOrder;
            object.save();
         });

         // The Gantt Object View
         this.hashViews["gantt"] = Gantt;

         // The Kanban Object View.
         this.hashViews["kanban"] = Kanban;

         this.PopupCustomIndex = new FPopupCustomIndex(
            AB,
            `${base}_customIndex`
         );
         this.PopupCustomIndex.on("changed", () => {
            this.refreshIndexes();
         });

         // // Various Popups on our page:
         this.PopupHeaderEditMenu = FPopupHeaderEditMenu(
            AB,
            `${base}_headerEditMenu`
         );
         this.PopupHeaderEditMenu.on("click", (action, field, node) => {
            this.callbackHeaderEditorMenu(action, field, node);
         });

         if (!this.settings.isReadOnly) {
            this.PopupDefineLabelComponent = new FPopupDefineLabel(
               AB,
               `${base}_defineLabel`
            );
            this.PopupDefineLabelComponent.on("changed", () => {
               this.callbackDefineLabel();
            });
         }
         // var PopupFilterDataTableComponent = new ABPopupFilterDataTable(
         //    App,
         //    idBase
         // );

         this.PopupFrozenColumnsComponent = new FPopupFrozenColumns(
            AB,
            `${base}_frozenFields`
         );
         this.PopupFrozenColumnsComponent.on("changed", (settings) => {
            this.callbackFrozenColumns(settings);
         });

         this.PopupHideFieldComponent = FPopupHideFields(
            AB,
            `${base}_hideFields`
         );
         this.PopupHideFieldComponent.on("changed", (settings) => {
            this.callbackFieldsVisible(settings);
         });

         // var PopupMassUpdateComponent = new ABPopupMassUpdate(App, idBase);
         if (!this.settings.isReadOnly) {
            this.PopupNewDataFieldComponent = FPopupNewDataField(
               AB,
               `${base}_popupNewDataField`
            );
         }

         this.PopupSortFieldComponent = FPopupSortField(
            AB,
            `${base}_sortFields`
         );
         this.PopupSortFieldComponent.on("changed", (settings) => {
            this.callbackSortFields(settings);
         });

         this.PopupExportObjectComponent = new FPopupExport(
            AB,
            `${base}_export`
         );

         this.PopupImportObjectComponent = new FPopupImport(
            AB,
            `${base}_import`
         );
         // this.PopupImportObjectComponent.on("done", () => {
         //    this.populateObjectWorkspace(this.CurrentObject);
         // });

         this.PopupViewSettingsComponent = FPopupViewSettings(
            AB,
            `${base}_popupAddView`,
            { isReadOnly: this.settings.isReadOnly }
         );
         if (!this.settings.isReadOnly) {
            this.PopupViewSettingsComponent.on("new.field", (key) => {
               this.PopupNewDataFieldComponent.show(null, key);
            });
         }

         // create ABViewDataCollection
         this.CurrentDatacollection = null;
         // {ABDataCollection}
         // An instance of an ABDataCollection to manage the data we are displaying
         // in our workspace.

         this.CurrentObjectID = null;
         // {string} the ABObject.id of the current Object we are editing.
      } // constructor

      ui() {
         var ids = this.ids;

         var view = "button";
         // at some point we thought this was a good idea.

         var _logic = this;
         // some of these callback fn() are useful to not have this
         // refer to this class, so we allow them to call _logic.XXX()
         // instead.

         var newViewButton = {
            id: this.ids.viewMenuNewView,
            view: "button",
            type: "icon",
            autowidth: true,
            css: "webix_transparent",
            label: L("New view"),
            icon: "fa fa-plus-circle",
            align: "center",
            click: () => {
               this.PopupViewSettingsComponent.show();
            },
         };

         var menuWorkspaceViews = {
            id: ids.viewMenu,
            view: "menu",
            // css: "darkgray",
            // borderless: true,
            // minWidth: 150,
            // autowidth: true,
            data: [],
            on: {
               onMenuItemClick: (id) => {
                  var item = $$(ids.viewMenu).getMenuItem(id);
                  if (id === ids.viewMenuButton) {
                     return;
                  }
                  if (item.isView) {
                     var view = this.workspaceViews.list((v) => v.id === id)[0];
                     this.switchWorkspaceView(view);
                  } else if (item.action === "edit") {
                     var view = this.workspaceViews.list(
                        (v) => v.id === item.viewId
                     )[0];
                     this.PopupViewSettingsComponent.show(view);
                  } else if (item.action === "delete") {
                     // Ask the user what to do about the existing file:
                     webix.confirm({
                        title: L("Delete View?"),
                        message: L(
                           "Are you sure you want to remove this view?"
                        ),
                        callback: (result) => {
                           if (result) {
                              var view = this.workspaceViews.list(
                                 (v) => v.id === item.viewId
                              )[0];
                              this.workspaceViews.viewRemove(view);
                              this.switchWorkspaceView(
                                 this.workspaceViews.getCurrentView()
                              );
                           }
                        },
                     });
                  }
               },
            },
            type: {
               subsign: true,
            },
         };

         var toolbar = {
            view: "toolbar",
            id: ids.toolbar,
            hidden: true,
            css: "webix_dark",
            elementsConfig: {
               autowidth: true,
               padding: 0,
               margin: 0,
            },
            margin: 0,
            padding: 0,
            rows: [
               {
                  cols: [
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonAddField,
                        label: L("Add field"),
                        icon: "fa fa-plus",
                        css: "webix_transparent",
                        type: "icon",
                        hidden: this.settings.isReadOnly,
                        // minWidth: 115,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarAddFields(this.$view);
                        },
                     },
                     { responsive: "hide", hidden: this.settings.isReadOnly },
                     {
                        view: view,
                        id: ids.buttonFieldsVisible,
                        label: L("Hide fields"),
                        icon: "fa fa-eye-slash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 105,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFieldsVisible(this.$view);
                        },
                     },
                     { responsive: "hide", id: ids.buttonFieldsVisibleSpacer },
                     {
                        view: view,
                        id: ids.buttonFilter,
                        label: L("Filters"),
                        icon: "fa fa-filter",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 70,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFilter(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonSort,
                        label: L("Sort"),
                        icon: "fa fa-sort",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 60,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarSort(this.$view);
                        },
                     },
                     { responsive: "hide", id: ids.buttonSortSpacer },
                     {
                        view: view,
                        id: ids.buttonFrozen,
                        label: L("Freeze"),
                        icon: "fa fa-thumb-tack",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        badge: null,
                        click: function () {
                           _logic.toolbarFrozen(this.$view);
                        },
                     },
                     { responsive: "hide", id: ids.buttonFrozenSpacer },
                     {
                        view: view,
                        id: ids.buttonLabel,
                        label: L("Label"),
                        icon: "fa fa-crosshairs",
                        css: "webix_transparent",
                        type: "icon",
                        hidden: this.settings.isReadOnly,
                        click: function () {
                           _logic.toolbarDefineLabel(this.$view);
                        },
                     },
                     { responsive: "hide", hidden: this.settings.isReadOnly },
                     // {
                     //  view: view,
                     //  label: L("Permission"),
                     //  icon: "lock",
                     //  type: "icon",
                     //  // autowidth: true,
                     //  click: function() {
                     //      _logic.toolbarPermission(this.$view);
                     //  }
                     //
                     // },
                     {
                        view: view,
                        id: ids.buttonImport,
                        label: L("Import"),
                        icon: "fa fa-upload",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        hidden: this.settings.isReadOnly,
                        click: function () {
                           _logic.toolbarButtonImport();
                        },
                     },
                     { responsive: "hide", hidden: this.settings.isReadOnly },
                     {
                        view: view,
                        id: ids.buttonExport,
                        label: L("Export"),
                        icon: "fa fa-download",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 80,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarButtonExport(this.$view);
                        },
                     },
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonMassUpdate,
                        label: L("Edit"),
                        icon: "fa fa-pencil-square-o",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 65,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarMassUpdate(this.$view);
                        },
                     },
                     {
                        responsive: "hide",
                        hidden: true,
                        id: ids.buttonMassUpdateSpacer,
                     },
                     {
                        view: view,
                        id: ids.buttonDeleteSelected,
                        label: L("Delete"),
                        icon: "fa fa-trash",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 85,
                        // autowidth: true,
                        badge: null,
                        hidden: true,
                        click: function () {
                           _logic.toolbarDeleteSelected(this.$view);
                        },
                     },
                     {
                        responsive: "hide",
                        hidden: true,
                        id: ids.buttonDeleteSelectedSpacer,
                     },
                  ],
               },
               {
                  css: { "background-color": "#747d84 !important" },
                  hidden: this.settings.isReadOnly,
                  cols: [
                     {
                        view: view,
                        id: ids.buttonIndex,
                        label: L("Add Index"),
                        icon: "fa fa-plus-circle",
                        css: "webix_transparent",
                        type: "icon",
                        click: () => {
                           this.PopupCustomIndex.open(this.CurrentObject);
                        },
                     },
                     {
                        id: ids.listIndex,
                        cols: [],
                     },
                     {
                        responsive: "hide",
                     },
                  ],
               },
            ],
         };

         // Our webix UI definition:
         return {
            view: "multiview",
            id: ids.component,
            borderless: true,
            rows: [
               {
                  id: ids.error,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-exclamation-triangle'></div>",
                     },
                     {
                        id: ids.error_msg,
                        view: "label",
                        align: "center",
                        label: L("There was an error"),
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.noSelection,
                  rows: [
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                     {
                        view: "label",
                        align: "center",
                        height: 200,
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-database'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select an object to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              label: L("Add new object"),
                              type: "form",
                              css: "webix_primary",
                              autowidth: true,
                              click: () => {
                                 this.emit("addNew", true);
                              },
                           },
                           {},
                        ],
                     },
                     {
                        maxHeight: uiConfig.xxxLargeSpacer,
                        hidden: uiConfig.hideMobile,
                     },
                  ],
               },
               {
                  id: ids.selectedObject,
                  type: "wide",
                  paddingY: 0,
                  // css: "ab-data-toolbar",
                  // borderless: true,
                  rows: [
                     {
                        cols: [newViewButton, menuWorkspaceViews],
                     },
                     toolbar,
                     {
                        padding: 0,
                        rows: [
                           {
                              view: "multiview",
                              cells: [Datatable.ui(), Kanban.ui(), Gantt.ui()],
                           },
                           // this.settings.isInsertable
                           //    ?
                           {
                              view: "button",
                              type: "form",
                              id: ids.buttonRowNew,
                              css: "webix_primary",
                              value: L("Add new row"),
                              hidden: this.settings.isReadOnly,
                              click: () => {
                                 this.rowAdd();
                              },
                           },
                           // : {
                           //      view: "layout",
                           //      rows: [],
                           //      hidden: true,
                           //   },
                        ],
                     },
                  ],
               },
            ],
         };
      } // ui()

      // Our init() function for setting up our UI
      init(AB) {
         this.AB = AB;

         var allInits = [];

         allInits.push(this.workspaceViews.init(AB));

         allInits.push(Datatable.init(AB));
         allInits.push(Gantt.init(AB));
         allInits.push(Kanban.init(AB));

         allInits.push(Track.init(AB));

         // Gantt.init();

         this.CurrentDatacollection = this.AB.datacollectionNew({});
         this.CurrentDatacollection.init();

         allInits.push(this.PopupCustomIndex.init(AB));

         Datatable.datacollectionLoad(this.CurrentDatacollection);
         Gantt.datacollectionLoad(this.CurrentDatacollection);
         Kanban.datacollectionLoad(this.CurrentDatacollection);
         // Gantt.datacollectionLoad(this.CurrentDatacollection);

         allInits.push(this.PopupHeaderEditMenu.init(AB));

         if (!this.settings.isReadOnly) {
            allInits.push(this.PopupDefineLabelComponent.init(AB));
         }

         // PopupFilterDataTableComponent.init({
         //    onChange: _logic.callbackFilterDataTable, // be notified when there is a change in the filters
         // });

         allInits.push(this.PopupFrozenColumnsComponent.init(AB));

         allInits.push(this.PopupHideFieldComponent.init(AB));

         // PopupMassUpdateComponent.init({
         //    // onSave:_logic.callbackAddFields			// be notified of something...who knows...
         // });

         // if (settings.isFieldAddable) {
         //    PopupNewDataFieldComponent.init({
         //       onSave: _logic.callbackAddFields, // be notified when a new Field is created & saved
         //    });
         // }
         if (!this.settings.isReadOnly) {
            allInits.push(this.PopupNewDataFieldComponent.init(AB));
            this.PopupNewDataFieldComponent.on("save", (...params) => {
               this.callbackAddFields(...params);
               this.PopupViewSettingsComponent.emit("field.added", params[0]);
            });
         }

         // // ?? what is this for ??
         // // var fieldList = Datatable.getFieldList();

         allInits.push(this.PopupSortFieldComponent.init(AB));

         allInits.push(this.PopupImportObjectComponent.init(AB));

         allInits.push(this.PopupExportObjectComponent.init(AB));

         allInits.push(this.PopupViewSettingsComponent.init(AB));
         this.PopupViewSettingsComponent.on("added", (view) => {
            this.callbackViewAdded(view);
         });
         this.PopupViewSettingsComponent.on("updated", (view) => {
            this.callbackViewUpdated(view);
         });

         $$(this.ids.noSelection).show();

         // this.refreshView();

         return Promise.all(allInits);
      }

      /**
       * @method applicationLoad
       * Initialize the Object Workspace with the given ABApplication.
       * @param {ABApplication} application
       *        The current ABApplication we are working with.
       */
      applicationLoad(application) {
         super.applicationLoad(application);
         if (!this.settings.isReadOnly) {
            this.PopupNewDataFieldComponent.applicationLoad(application);
         }

         // this.CurrentDatacollection.application = CurrentApplication;
      }

      /**
       * @function callbackAddFields
       * call back for when an ABFieldXXX is added to the current ABObject.
       * @param {ABField} field
       */
      callbackAddFields(/* field */) {
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackDefineLabel
       *
       * call back for when the Define Label popup is finished.
       */
      // callbackDefineLabel: function () {},

      /**
       * @function callbackFilterDataTable
       *
       * call back for when the Define Label popup is finished.
       */
      callbackFilterDataTable() {
         // Since we are making server side requests lets offload the badge count to another function so it can be called independently
         _logic.getBadgeFilters();
         // this will be handled by the server side request now
         _logic.loadData();
      }

      /**
       * @function callbackFrozenColumns
       *
       * call back for when the hidden fields have changed.
       */
      async callbackFrozenColumns(frozen_field_id) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.frozenColumnID = frozen_field_id;

         try {
            await this.workspaceViews.save();
         } catch (e) {
            // intentionally left blank
         }

         this.getBadgeFrozenColumn();

         this.PopupHideFieldComponent.setFrozenColumnID(
            currentView.frozenColumnID
         );
         this.refreshView();
      }

      /**
       * @function callbackFieldsVisible
       *
       * call back for when the hidden fields have changed.
       */
      async callbackFieldsVisible(hidden_fields_settings) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.hiddenFields = hidden_fields_settings;

         try {
            await this.workspaceViews.save();
         } catch (e) {
            // intentionally left blank
         }

         this.getBadgeHiddenFields();
         this.PopupFrozenColumnsComponent.setHiddenFields(
            hidden_fields_settings
         );
         this.refreshView();
         this.getBadgeFrozenColumn();
      }

      /**
       * @function callbackCheckboxChecked
       *
       * call back for when the checkbox of datatable is checked
       */

      callbackCheckboxChecked(state) {
         if (state == "enable") {
            this.enableUpdateDelete();
         } else {
            this.disableUpdateDelete();
         }
      }

      // /**
      //  * @function callbackColumnOrderChange
      //  *
      //  */
      // callbackColumnOrderChange(object) {
      //    // TODO:
      //    _logic.getBadgeHiddenFields();
      //    _logic.getBadgeFrozenColumn();
      // }

      refreshView() {
         var ids = this.ids;
         this.warningsRefresh(this.CurrentObject);
         var currentView = this.workspaceViews.getCurrentView();
         switch (currentView.type) {
            case "gantt":
               Gantt.show(currentView);
               break;

            case "grid":
               Datatable.refreshHeader(
                  currentView.hiddenFields,
                  currentView.filterConditions,
                  currentView.sortFields,
                  currentView.frozenColumnID
               );
               break;

            case "kanban":
               Kanban.show(currentView);
               break;
         }
      }

      /**
       * @function callbackHeaderEditorMenu
       *
       * call back for when an editor menu action has been selected.
       * @param {string} action [ 'hide', 'filter', 'sort', 'edit', 'delete' ]
       */
      async callbackHeaderEditorMenu(action, field, node) {
         switch (action) {
            case "hide":
               var currentView = this.workspaceViews.getCurrentView();
               var newFields = [];
               var isHidden =
                  currentView.hiddenFields.filter((fID) => {
                     return fID == field.columnName;
                  }).length > 0;
               if (isHidden) {
                  // get remaining fields
                  newFields = currentView.hiddenFields.filter((fID) => {
                     return fID != field.columnName;
                  });
               } else {
                  newFields = currentView.hiddenFields;
                  newFields.push(field.columnName);
               }

               // update our Object with current hidden fields
               currentView.hiddenFields = newFields;
               try {
                  await this.workspaceViews.save();
               } catch (e) {
                  // intentionally left blank
               }
               this.PopupHideFieldComponent.setSettings(
                  currentView.hiddenFields
               );
               this.PopupFrozenColumnsComponent.setHiddenFields(
                  currentView.hiddenFields
               );
               this.refreshView();
               this.getBadgeHiddenFields();
               this.getBadgeFrozenColumn();
               break;

            case "filter":
               _logic.toolbarFilter($$(ids.buttonFilter).$view, field.id);
               break;

            case "sort":
               this.toolbarSort($$(this.ids.buttonSort).$view, field.id);
               break;

            case "freeze":
               var currentView = this.workspaceViews.getCurrentView();
               currentView.frozenColumnID = field.columnName;
               try {
                  await this.workspaceViews.save();
               } catch (e) {
                  // intentionally left blank
               }
               this.PopupFrozenColumnsComponent.setValue(
                  currentView.frozenColumnID || ""
               );
               this.PopupHideFieldComponent.setFrozenColumnID(
                  currentView.frozenColumnID || ""
               );
               this.refreshView();
               this.getBadgeFrozenColumn();
               break;

            case "edit":
               // pass control on to our Popup:
               if (!this.settings.isReadOnly) {
                  this.PopupNewDataFieldComponent.show(field);
               }
               break;

            case "delete":
               // verify they mean to do this:
               webix.confirm({
                  title: L("Delete data field"),
                  message: L("Do you want to delete <b>{0}</b>?", [
                     field.label,
                  ]),
                  callback: (isOK) => {
                     if (isOK) {
                        this.busy();
                        field
                           .destroy()
                           .then(() => {
                              this.ready();
                              this.refreshView();
                              this.loadData();

                              // recursive fn to remove any form/detail fields related to this field
                              function checkPages(list, cb) {
                                 if (list.length == 0) {
                                    cb();
                                 } else {
                                    var page = list.shift();

                                    // begin calling removeField for each main page in the app
                                    // this will kick off a chain of events that will have removeField called on
                                    // all pages, subpages, widgets and views.
                                    page.removeField(field, (err) => {
                                       if (err) {
                                          cb(err);
                                       } else {
                                          checkPages(list, cb);
                                       }
                                    });
                                 }
                              }

                              checkPages(
                                 this.CurrentApplication.pages(),
                                 (err) => {}
                              );
                           })
                           .catch((err) => {
                              this.ready();
                              if (err && err.message) {
                                 webix.alert({
                                    type: "alert-error",
                                    title: L("Could not delete"),
                                    text: err.message,
                                 });
                              }

                              this.AB.notify.developer(err, {
                                 context: "Error trying to delete field",
                                 fields: field.toObj(),
                              });
                           });
                     }
                  },
               });
               break;
         }
      }

      busy() {
         $$(this.ids.component)?.showProgress?.({ type: "icon" });
      }

      /**
       * @function callbackMassUpdate
       *
       * call back for when the mass update is fired
       */
      callbackMassUpdate() {
         // _logic.getBadgeSortFields();
         _logic.loadData();
      }

      /**
       * @function callbackSortFields
       *
       * call back for when the sort fields popup changes
       **/
      async callbackSortFields(sort_settings) {
         var currentView = this.workspaceViews.getCurrentView();
         currentView.sortFields = sort_settings;
         await this.workspaceViews.save();
         this.getBadgeSortFields();
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackViewAdded
       *
       * call back for when a new workspace view is added
       */
      async callbackViewAdded(view) {
         var newView = await this.workspaceViews.viewNew(view);
         await this.switchWorkspaceView(newView);
         this.refreshView();
         this.loadData();
      }

      /**
       * @function callbackViewUpdated
       *
       * call back for when a workspace view is updated
       */
      async callbackViewUpdated(view) {
         await this.workspaceViews.viewUpdate(view);
         this.refreshWorkspaceViewMenu();
         this.refreshView();
      }

      /**
       * @function enableUpdateDelete
       *
       * enable the update or delete buttons in the toolbar if there are any items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      enableUpdateDelete() {
         var ids = this.ids;
         $$(ids.buttonMassUpdate).show();
         $$(ids.buttonMassUpdateSpacer).show();
         $$(ids.buttonDeleteSelected).show();
         $$(ids.buttonDeleteSelectedSpacer).show();
      }

      /**
       * @function enableUpdateDelete
       *
       * disable the update or delete buttons in the toolbar if there no items selected
       * we will make this externally accessible so we can call it from within the datatable component
       */
      disableUpdateDelete() {
         var ids = this.ids;
         $$(ids.buttonMassUpdate).hide();
         $$(ids.buttonMassUpdateSpacer).hide();
         $$(ids.buttonDeleteSelected).hide();
         $$(ids.buttonDeleteSelectedSpacer).hide();
      }

      /**
       * @function getBadgeFilters
       *
       * we need to set the badge count for filters on load and after filters are added or removed
       */

      getBadgeFilters() {
         var ids = this.ids;
         var filterConditions = this.workspaceViews.filterConditions;
         var numberOfFilter = 0;

         if (filterConditions?.rules?.length)
            numberOfFilter = filterConditions.rules.length;

         if (typeof filterConditions != "undefined") {
            $$(ids.buttonFilter).define("badge", numberOfFilter || null);
            $$(ids.buttonFilter).refresh();
         }
      }

      /**
       * @function getBadgeFrozenColumn
       *
       * we need to set the badge count for frozen columns on load and after changed are added or removed
       */

      getBadgeFrozenColumn() {
         var ids = this.ids;
         var frozenID = this.workspaceViews.frozenColumnID;
         var badgeNumber = null;

         // get the current position of the frozenID in our Datatable
         if (frozenID !== "" && typeof frozenID != "undefined") {
            badgeNumber = Datatable.getColumnIndex(frozenID);
         }

         $$(ids.buttonFrozen).define("badge", badgeNumber);
         $$(ids.buttonFrozen).refresh();
      }

      /**
       * @function getBadgeHiddenFields
       *
       * we need to set the badge count for hidden fields on load and after fields are hidden or shown
       */

      getBadgeHiddenFields() {
         var hiddenFields = this.workspaceViews.hiddenFields;

         if (typeof hiddenFields != "undefined") {
            $$(this.ids.buttonFieldsVisible).define(
               "badge",
               hiddenFields.length || null
            );
            $$(this.ids.buttonFieldsVisible).refresh();
         }
      }

      /**
       * @function getBadgeSortFields
       *
       * we need to set the badge count for sorts on load and after sorts are added or removed
       */

      getBadgeSortFields() {
         var ids = this.ids;
         var sortFields = (this.workspaceViews.sortFields || []).filter(
            (f) => f.key != ""
         );

         if (typeof sortFields != "undefined") {
            $$(ids.buttonSort).define("badge", sortFields.length || null);
            $$(ids.buttonSort).refresh();
         }
      }

      ready() {
         $$(this.ids.component)?.hideProgress?.();
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      async rowAdd() {
         // safety check
         // if (!this.settings.isEditable) return;

         // create the new data entry

         var object = this.CurrentObject;
         if (!object) return;

         var emptyObj = object.defaultValues();
         try {
            var newObj = await object.model().create(emptyObj);
            if (newObj == null) return;

            // Now stick this into the DataCollection so the displayed widget
            // will update itself:
            var dc = this.CurrentDatacollection.$dc;
            if (dc && !dc.exists(newObj.id)) {
               dc.add(newObj, 0);
            }
         } catch (e) {
            this.AB.notify.developer(e, {
               context:
                  "ui_work_object_workspace:rowAdd(): error creating empty object",
               emptyObj,
            });

            var L = this.AB.Label();
            webix.alert({
               title: L("Unable to create new row"),
               text: L("An administrator has already been alerted."),
            });
         }
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /**
       * @function toolbarAddFields
       *
       * Show the popup to allow the user to create new fields for
       * this object.
       */
      toolbarAddFields($view) {
         this.PopupNewDataFieldComponent.show();
      }

      toolbarButtonImport() {
         this.PopupImportObjectComponent.show();
      }

      toolbarButtonExport($view) {
         this.PopupExportObjectComponent.show($view);
      }

      toolbarDeleteSelected($view) {
         // Pass this onto our Datatable to reuse the ABViewGrid's
         // delete selection routines.
         Datatable.deleteSelected($view);
      }

      /**
       * @function toolbarDefineLabel
       *
       * Show the popup to allow the user to define the default label for
       * this object.
       */
      toolbarDefineLabel($view) {
         this.PopupDefineLabelComponent.show($view);
      }

      /**
       * @function toolbarFieldsVisible
       *
       * Show the popup to allow the user to hide columns for this view.
       */
      toolbarFieldsVisible($view) {
         this.PopupHideFieldComponent.show($view);
      }

      /**
       * @function toolbarFilter
       *
       * show the popup to add a filter to the datatable
       */
      toolbarFilter($view, fieldId) {
         PopupFilterDataTableComponent.show($view, fieldId);
      }

      /**
       * @function toolbarFrozen
       *
       * show the popup to freeze columns for the datatable
       */
      toolbarFrozen($view) {
         this.PopupFrozenColumnsComponent.show($view);
      }

      toolbarPermission($view) {
         console.error("TODO: toolbarPermission()");
      }

      toolbarMassUpdate($view) {
         Datatable.massUpdate($view);
      }

      /**
       * @function toolbarSort
       *
       * show the popup to sort the datatable
       */
      toolbarSort($view, fieldId) {
         this.PopupSortFieldComponent.show($view, fieldId);
      }

      /**
       * @method populateObjectWorkspace()
       * Initialize the Object Workspace with the provided ABObject.
       * @param {uuid} objectID
       *        current ABObject.id instance we are working with.
       */
      async populateObjectWorkspace(objectID) {
         $$(this.ids.toolbar).show();
         $$(this.ids.selectedObject).show();

         this.CurrentObjectID = objectID;
         var object = this.CurrentObject;

         // get current view from object
         this.workspaceViews.objectLoad(object);
         var currentView = this.workspaceViews.getCurrentView();
         // {WorkspaceView}
         // The current workspace view that is being displayed in our work area
         // currentView.component {ABViewGrid | ABViewKanBan | ABViewGantt}

         this.CurrentDatacollection.datasource = object;

         Datatable.objectLoad(object);
         Kanban.objectLoad(object);
         Gantt.objectLoad(object);

         if (!this.settings.isReadOnly) {
            this.PopupNewDataFieldComponent.objectLoad(object);
            this.PopupDefineLabelComponent.objectLoad(object);
         }
         // PopupFilterDataTableComponent.objectLoad(object);
         this.PopupFrozenColumnsComponent.objectLoad(object);

         this.PopupHideFieldComponent.objectLoad(object);

         this.PopupSortFieldComponent.objectLoad(object);

         this.PopupImportObjectComponent.objectLoad(object);

         this.PopupExportObjectComponent.objectLoad(object);

         // NOTE: make sure Datatable exists before this:
         if (!this._handler_show) {
            this._handler_show = () => {
               this.PopupExportObjectComponent.setGridComponent(
                  Datatable.$grid
               );
            };
            Datatable.on("show", this._handler_show);
         }

         this.PopupExportObjectComponent.setFilename(object.label);
         this.PopupViewSettingsComponent.objectLoad(object);

         // _logic.refreshToolBarView();

         this.refreshIndexes();

         // // $$(ids.component).setValue(ids.selectedObject);
         // $$(ids.selectedObject).show(true, false);

         // // disable add fields into the object
         // if (
         //    object.isExternal ||
         //    object.isImported ||
         //    !settings.isFieldAddable
         // ) {
         //    $$(ids.buttonAddField).disable();
         //    $$(ids.buttonImport).disable();
         // } else {
         //    $$(ids.buttonAddField).enable();
         //    $$(ids.buttonImport).enable();
         // }

         await this.switchWorkspaceView(currentView);
         this.refreshWorkspaceViewMenu();

         this.refreshView();

         // // display the proper ViewComponent
         // var currDisplay = hashViews[currentView.type];
         // currDisplay.show();
         // // viewPicker needs to show this is the current view.
      }

      /**
       * @function clearObjectWorkspace()
       *
       * Clear the object workspace.
       */
      clearObjectWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection).show(false, false);
      }

      queryLoad(query) {
         // attempt to use a query as an object
         this.objectLoad(query);
      }

      // get CurrentObject() {
      //    return this.AB.objectByID(this.CurrentObjectID);
      // }

      /**
       * @function loadAll
       * Load all records
       *
       */
      loadAll() {
         Datatable.loadAll();
      }

      loadData() {
         // update ABViewDataCollection settings
         var wheres = {
            glue: "and",
            rules: [],
         };
         if (this.workspaceViews?.filterConditions?.rules?.length > 0) {
            wheres = this.workspaceViews.filterConditions;
         }

         var sorts = [];
         if (this.workspaceViews?.sortFields?.length > 0) {
            sorts = this.workspaceViews?.sortFields;
         }

         this.CurrentDatacollection.datasource = this.CurrentObject;

         this.CurrentDatacollection.fromValues({
            settings: {
               datasourceID: this.CurrentObjectID,
               objectWorkspace: {
                  filterConditions: wheres,
                  sortFields: sorts,
               },
            },
         });

         this.CurrentDatacollection.refreshFilterConditions(wheres);
         this.CurrentDatacollection.clearAll();

         // WORKAROUND: load all data becuase kanban does not support pagination now
         let view = this.workspaceViews.getCurrentView();
         if (view.type === "gantt" || view.type === "kanban") {
            this.CurrentDatacollection.settings.loadAll = true;
            this.CurrentDatacollection.loadData(0);
         } else {
            this.CurrentDatacollection.loadData(0, 30).catch((err) => {
               var message = err.toString();
               if (typeof err == "string") {
                  try {
                     var jErr = JSON.parse(err);
                     if (jErr.data && jErr.data.sqlMessage) {
                        message = jErr.data.sqlMessage;
                     }
                  } catch (e) {}
               }
               var ids = this.ids;
               $$(ids.error).show();
               $$(ids.error_msg).define("label", message);
               $$(ids.error_msg).refresh();

               // webix.alert({
               //     title: "Error loading object Values ",
               //     ok: "fix it",
               //     text: message,
               //     type: "alert-error"
               // });
               this.AB.notify.developer(err, {
                  context: "ui_work_object_workspace.loadData()",
                  message,
                  datacollection: this.CurrentDatacollection.toObj(),
               });
            });
         }
      }

      async switchWorkspaceView(view) {
         if (this.hashViews[view.type]) {
            this.workspaceViews.setCurrentView(view.id);
            await this.hashViews[view.type].show(view);
            this.refreshWorkspaceViewMenu();

            // now update the rest of the toolbar for this view:
            this.refreshToolBarView();

            // make sure our Popups are updated:
            this.PopupFrozenColumnsComponent.setValue(
               view.frozenColumnID || ""
            );
            this.PopupFrozenColumnsComponent.setHiddenFields(view.hiddenFields);

            this.PopupHideFieldComponent.setSettings(view.hiddenFields);
            this.PopupHideFieldComponent.setFrozenColumnID(
               view.frozenColumnID || ""
            );

            this.PopupSortFieldComponent.setSettings(view.sortFields);

            this.PopupExportObjectComponent.setHiddenFields(view.hiddenFields);

            // save current view
            this.workspaceViews.save();

            this.loadData();
         }
      }

      /**
       * @function refreshToolBarView
       * update the display of the toolbar buttons based upon
       * the current view being displayed.
       */
      refreshToolBarView() {
         var ids = this.ids;

         var currentView = this.workspaceViews.getCurrentView();
         switch (currentView.type) {
            case "grid":
               $$(ids.buttonFieldsVisible).show();
               $$(ids.buttonFrozen).show();
               $$(ids.buttonSort).show();
               $$(ids.buttonFieldsVisibleSpacer).show();
               $$(ids.buttonFrozenSpacer).show();
               $$(ids.buttonSortSpacer).show();
               break;
            case "kanban":
               $$(ids.buttonFieldsVisible).hide();
               $$(ids.buttonFrozen).hide();
               $$(ids.buttonSort).hide();
               $$(ids.buttonFieldsVisibleSpacer).hide();
               $$(ids.buttonFrozenSpacer).hide();
               $$(ids.buttonSortSpacer).hide();
               break;
         }

         // get badge counts
         this.getBadgeHiddenFields();
         this.getBadgeFrozenColumn();
         this.getBadgeSortFields();
         this.getBadgeFilters();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         // disable add fields into the object
         if (this.CurrentObject.isExternal || this.CurrentObject.isImported) {
            $$(ids.buttonAddField).disable();
         } else {
            $$(ids.buttonAddField).enable();
         }
      }

      /**
       * @method refreshWorkspaceViewMenu()
       * On the top of our workspace, we show a list if different views
       * of our current object: Grid, Kanban, Gantt, etc...
       * This method will redraw those selectors based upon our current
       * settings.
       */
      refreshWorkspaceViewMenu() {
         var currentViewId = this.workspaceViews.getCurrentView().id;
         var submenu = this.workspaceViews.list().map((view) => ({
            id: view.id,
            hash: view.type,
            value: view.name,
            isView: true,
            $css: view.id === currentViewId ? "selected" : "",
            icon: `fa fa-${view.icon}`, // view.constructor.icon(),
            submenu: view.isDefaultView
               ? null
               : [
                    {
                       value: L("Edit"),
                       icon: "fa fa-cog",
                       viewId: view.id,
                       action: "edit",
                    },
                    {
                       value: L("Delete"),
                       icon: "fa fa-trash",
                       viewId: view.id,
                       action: "delete",
                    },
                 ],
         }));

         // var currView = this.CurrentObject.workspaceViews.getCurrentView();
         // var icon = currView.constructor.icon();
         var $viewMenu = $$(this.ids.viewMenu);
         $viewMenu.clearAll();
         $viewMenu.define("data", submenu);
         $viewMenu.refresh();
      }

      refreshIndexes() {
         let indexes = this.CurrentObject?.indexes() || [];

         // clear indexes list
         webix.ui([], $$(this.ids.listIndex));

         indexes.forEach((index) => {
            this.addNewIndex(index);
         });
      }

      addNewIndex(index) {
         $$(this.ids.listIndex).addView({
            view: "button",
            label: index.label || index.name,
            icon: "fa fa-key",
            css: "webix_transparent",
            type: "icon",
            width: 160,
            click: () => {
               this.PopupCustomIndex.open(this.CurrentObject, index);
            },
         });
      }
   }

   return new UIWorkObjectWorkspace(ibase, init_settings);
}
