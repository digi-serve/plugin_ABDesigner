/*
 * ui_work_object_workspace
 *
 * Manage the Object Workspace area.
 */

import ABWorkspaceDatatable from "./ui_work_object_workspace_view_grid";

// const ABWorkspaceKanBan = require("./ab_work_object_workspace_kanban");
// const ABWorkspaceGantt = require("./ab_work_object_workspace_gantt");

// const ABWorkspaceIndex = require("./ab_work_object_workspace_index");
// const ABWorkspaceTrack = require("./ab_work_object_workspace_track");

// const ABPopupDefineLabel = require("./ab_work_object_workspace_popupDefineLabel");
// const ABPopupFilterDataTable = require("./ab_work_object_workspace_popupFilterDataTable");
// const ABPopupFrozenColumns = require("./ab_work_object_workspace_popupFrozenColumns");
// const ABPopupHideFields = require("./ab_work_object_workspace_popupHideFields");
// const ABPopupMassUpdate = require("./ab_work_object_workspace_popupMassUpdate");

// const ABPopupSortField = require("./ab_work_object_workspace_popupSortFields");
// const ABPopupExport = require("./ab_work_object_workspace_popupExport");
// const ABPopupImport = require("./ab_work_object_workspace_popupImport");
// const ABPopupNewDataField = require("./ab_work_object_workspace_popupNewDataField");
import FPopupHeaderEditMenu from "./ui_work_object_workspace_popupHeaderEditMenu";
import ABPopupNewDataField from "./ui_work_object_workspace_popupNewDataField";
import ABPopupViewSettings from "./ui_work_object_workspace_popupViewSettings";
import WorkspaceViews from "./ui_work_object_workspace_workspaceviews";

export default function (AB, init_settings) {
   const uiConfig = AB.Config.uiSettings();
   var L = function (...params) {
      return AB.Multilingual.labelPlugin("ABDesigner", ...params);
   };

   var Datatable = ABWorkspaceDatatable(AB);

   class UIWorkObjectWorkspace extends AB.ClassUI {
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
      constructor(settings = {}) {
         var base = "abd_work_object_workspace";

         super({
            component: `${base}_component`,

            buttonAddField: `${base}_buttonAddField`,
            buttonDeleteSelected: `${base}_deleteSelected`,
            buttonExport: `${base}_buttonExport`,
            buttonImport: `${base}_buttonImport`,
            buttonFieldsVisible: `${base}_buttonFieldsVisible`,
            buttonFilter: `${base}_buttonFilter`,
            buttonFrozen: `${base}_buttonFrozen`,
            buttonLabel: `${base}_buttonLabel`,
            buttonMassUpdate: `${base}_buttonMassUpdate`,
            buttonRowNew: `${base}_buttonRowNew`,
            buttonSort: `${base}_buttonSort`,

            listIndex: `${base}_listIndex`,
            buttonIndex: `${base}_buttonIndex`,

            datatable: `${base}_datatable`,
            error: `${base}_error`,
            error_msg: `${base}_error_msg`,

            viewMenu: `${base}_viewMenu`,
            viewMenuButton: `${base}_viewMenuButton`,
            viewMenuNewView: `${base}_viewMenuNewView`,

            // Toolbar:
            toolbar: `${base}_toolbar`,

            noSelection: `${base}_noSelection`,
            selectedObject: `${base}_selectedObject`,
         });

         // default settings
         settings.trackView = settings.trackView ?? true;
         settings.allowDelete = settings.allowDelete ?? true;
         settings.isInsertable = settings.isInsertable ?? true;
         settings.isEditable = settings.isEditable ?? true;
         settings.massUpdate = settings.massUpdate ?? true;
         settings.configureHeaders = settings.configureHeaders ?? true;
         settings.isFieldAddable = settings.isFieldAddable ?? true;
         this.settings = settings;

         this.workspaceViews = WorkspaceViews(AB);
         this.hashViews = {};
         // {hash}  { view.id : webix_component }
         // a hash of the live workspace view components

         // The Grid that displays our object:
         this.hashViews["grid"] = Datatable;
         Datatable.on("column.header.clicked", (node, EditField) => {
            this.PopupHeaderEditMenu.show(node, EditField);
         });

         // var KanBan = new ABWorkspaceKanBan(base);
         // this.hashViews["kanban"] = KanBan;

         // var Gantt = new ABWorkspaceGantt(base);
         // this.hashViews["gantt"] = Gantt;

         // let CustomIndex = new ABWorkspaceIndex(App, idBase);
         // let Track = new ABWorkspaceTrack(App, idBase);

         // // Various Popups on our page:
         this.PopupHeaderEditMenu = FPopupHeaderEditMenu(AB);
         this.PopupHeaderEditMenu.on("click", (action, field, node) => {
            this.callbackHeaderEditorMenu(action, field, node);
         });

         // var PopupDefineLabelComponent = new ABPopupDefineLabel(App, idBase);

         // var PopupFilterDataTableComponent = new ABPopupFilterDataTable(
         //    App,
         //    idBase
         // );

         // var PopupFrozenColumnsComponent = new ABPopupFrozenColumns(
         //    App,
         //    idBase
         // );

         // var PopupHideFieldComponent = new ABPopupHideFields(App, idBase);

         // var PopupMassUpdateComponent = new ABPopupMassUpdate(App, idBase);

         this.PopupNewDataFieldComponent = ABPopupNewDataField(AB);

         // var PopupSortFieldComponent = new ABPopupSortField(App, idBase);

         // var PopupExportObjectComponent = new ABPopupExport(App, idBase);

         // var PopupImportObjectComponent = new ABPopupImport(App, idBase);

         this.PopupViewSettingsComponent = ABPopupViewSettings(AB);

         // create ABViewDataCollection
         this.CurrentDatacollection = null;
         // {ABDataCollection}
         // An instance of an ABDataCollection to manage the data we are displaying
         // in our workspace.

         this.CurrentApplicationID = null;
         // {string} the ABApplication.id of the current application

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
            css: "webix_primary",
            label: L("New view"),
            icon: "fa fa-plus",
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
                              this.workspaceViews.removeView(view);
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
                        hidden: !this.settings.isFieldAddable,
                        // minWidth: 115,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarAddFields(this.$view);
                        },
                     },
                     { responsive: "hide" },
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
                     { responsive: "hide" },
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
                     { responsive: "hide" },
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
                     { responsive: "hide" },
                     {
                        view: view,
                        id: ids.buttonLabel,
                        label: L("Label"),
                        icon: "fa fa-crosshairs",
                        css: "webix_transparent",
                        type: "icon",
                        // minWidth: 75,
                        // autowidth: true,
                        click: function () {
                           _logic.toolbarDefineLabel(this.$view);
                        },
                     },
                     { responsive: "hide" },
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
                        click: function () {
                           _logic.toolbarButtonImport();
                        },
                     },
                     { responsive: "hide" },
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
                     { responsive: "hide" },
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
                     { responsive: "hide" },
                  ],
               },
               {
                  css: { "background-color": "#747d84 !important" },
                  cols: [
                     {
                        view: view,
                        id: ids.buttonIndex,
                        label: L("Add Index"),
                        icon: "fa fa-plus-circle",
                        css: "webix_transparent",
                        type: "icon",
                        click: () => {
                           this.CustomIndex.open(this.CurrentObject);
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
                              cells: [
                                 Datatable.ui() /*, Gantt.ui(), KanBan.ui() */,
                              ],
                           },
                           this.settings.isInsertable
                              ? {
                                   view: "button",
                                   type: "form",
                                   id: ids.buttonRowNew,
                                   css: "webix_primary",
                                   value: L("Add new row"),
                                   click: () => {
                                      this.rowAdd();
                                   },
                                }
                              : {
                                   view: "layout",
                                   rows: [],
                                   hidden: true,
                                },
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

         // Datatable.init({
         //    onEditorMenu: _logic.callbackHeaderEditorMenu,
         //    onColumnOrderChange: _logic.callbackColumnOrderChange,
         //    onCheckboxChecked: _logic.callbackCheckboxChecked,
         // });
         // KanBan.init();
         // Gantt.init();

         this.CurrentDatacollection = this.AB.datacollectionNew({});
         this.CurrentDatacollection.init();

         // CustomIndex.init({
         //    onChange: _logic.refreshIndexes,
         // });
         // Track.init();

         Datatable.datacollectionLoad(this.CurrentDatacollection);
         // KanBan.datacollectionLoad(this.CurrentDatacollection);
         // Gantt.datacollectionLoad(this.CurrentDatacollection);

         allInits.push(this.PopupHeaderEditMenu.init(AB));

         // PopupDefineLabelComponent.init({
         //    onChange: _logic.callbackDefineLabel, // be notified when there is a change in the label
         // });

         // PopupFilterDataTableComponent.init({
         //    onChange: _logic.callbackFilterDataTable, // be notified when there is a change in the filters
         // });

         // PopupFrozenColumnsComponent.init({
         //    onChange: _logic.callbackFrozenColumns, // be notified when there is a change in the frozen columns
         // });

         // PopupHideFieldComponent.init({
         //    onChange: _logic.callbackFieldsVisible, // be notified when there is a change in the hidden fields
         // });

         // PopupMassUpdateComponent.init({
         //    // onSave:_logic.callbackAddFields			// be notified of something...who knows...
         // });

         // if (settings.isFieldAddable) {
         //    PopupNewDataFieldComponent.init({
         //       onSave: _logic.callbackAddFields, // be notified when a new Field is created & saved
         //    });
         // }
         allInits.push(this.PopupNewDataFieldComponent.init(AB));
         this.PopupNewDataFieldComponent.on("save", (...params) => {
            this.callbackAddFields(...params);
         });

         // // ?? what is this for ??
         // // var fieldList = Datatable.getFieldList();

         // PopupSortFieldComponent.init({
         //    onChange: _logic.callbackSortFields, // be notified when there is a change in the sort fields
         // });

         // PopupImportObjectComponent.init({
         //    onDone: () => {
         //       // refresh data in object
         //       _logic.populateObjectWorkspace(CurrentObject);
         //    },
         // });

         // PopupExportObjectComponent.init({});

         allInits.push(this.PopupViewSettingsComponent.init(AB));
         this.PopupViewSettingsComponent.on("added", (view) => {
            this.callbackViewAdded(view);
         });
         this.PopupViewSettingsComponent.on("updated", (view) => {
            this.callbackViewUpdated(view);
         });

         $$(this.ids.noSelection).show();

         return Promise.all(allInits);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {string} appID
       */
      applicationLoad(appID) {
         this.CurrentApplicationID = appID;
         this.PopupNewDataFieldComponent.applicationLoad(appID);

         // this.CurrentDatacollection.application = CurrentApplication;
      }

      /**
       * @function callbackAddFields
       * call back for when an ABFieldXXX is added to the current ABObject.
       * @param {ABField} field
       */
      callbackAddFields(/* field */) {

         var fields = this.CurrentObject?.fields() || [];
         var hiddenFields = [];
         var filters = [];
         var sorts = [];
         var frozenColumns = [];

         Datatable.refreshHeader(
            fields,
            hiddenFields,
            filters,
            sorts,
            frozenColumns
         );
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
      callbackFrozenColumns(frozen_field_id) {
         // We need to load data first because there isn't anything to look at if we don't
         // _logic.loadData();
         // DataTable.refresh();

         this.CurrentObject.workspaceFrozenColumnID = frozen_field_id;
         this.CurrentObject.save().then(() => {
            this.getBadgeFrozenColumn();

            PopupHideFieldComponent.setFrozenColumnID(
               this.CurrentObject.objectWorkspace.frozenColumnID || ""
            );

            Datatable.refreshHeader();
         });
      }

      /**
       * @function callbackFieldsVisible
       *
       * call back for when the hidden fields have changed.
       */
      callbackFieldsVisible(hidden_fields_settings) {
         this.CurrentObject.workspaceHiddenFields = hidden_fields_settings;
         this.CurrentObject.save().then(() => {
            _logic.getBadgeHiddenFields();

            PopupFrozenColumnsComponent.setHiddenFields(hidden_fields_settings);

            Datatable.refreshHeader();
         });
      }

      /**
       * @function callbackCheckboxChecked
       *
       * call back for when the checkbox of datatable is checked
       */

      callbackCheckboxChecked(state) {
         if (state == "enable") {
            _logic.enableUpdateDelete();
         } else {
            _logic.disableUpdateDelete();
         }
      }

      /**
       * @function callbackColumnOrderChange
       *
       */
      callbackColumnOrderChange(object) {
         _logic.getBadgeHiddenFields();
         _logic.getBadgeFrozenColumn();
      }

      /**
       * @function callbackHeaderEditorMenu
       *
       * call back for when an editor menu action has been selected.
       * @param {string} action [ 'hide', 'filter', 'sort', 'edit', 'delete' ]
       */
      callbackHeaderEditorMenu(action, field, node) {
         switch (action) {
            case "hide":
               var newFields = [];
               var isHidden =
                  this.CurrentObject.workspaceHiddenFields.filter((fID) => {
                     return fID == field.columnName;
                  }).length > 0;
               if (isHidden) {
                  // get remaining fields
                  newFields = this.CurrentObject.workspaceHiddenFields.filter(
                     (fID) => {
                        return fID != field.columnName;
                     }
                  );
               } else {
                  newFields = this.CurrentObject.workspaceHiddenFields;
                  newFields.push(field.columnName);
               }

               // update our Object with current hidden fields
               this.CurrentObject.workspaceHiddenFields = newFields;
               this.CurrentObject.save()
                  .then(function () {
                     PopupHideFieldComponent.setValue(
                        this.CurrentObject.objectWorkspace.hiddenFields
                     );
                     PopupFrozenColumnsComponent.setHiddenFields(
                        this.CurrentObject.objectWorkspace.hiddenFields
                     );
                     Datatable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceHiddenFields",
                        { error: err, fields: newFields }
                     );
                  });
               break;
            case "filter":
               _logic.toolbarFilter($$(ids.buttonFilter).$view, field.id);
               break;
            case "sort":
               _logic.toolbarSort($$(ids.buttonSort).$view, field.id);
               break;
            case "freeze":
               this.CurrentObject.workspaceFrozenColumnID = field.columnName;
               this.CurrentObject.save()
                  .then(function () {
                     PopupFrozenColumnsComponent.setValue(
                        this.CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     PopupHideFieldComponent.setFrozenColumnID(
                        this.CurrentObject.objectWorkspace.frozenColumnID || ""
                     );
                     Datatable.refreshHeader();
                  })
                  .catch(function (err) {
                     OP.Error.log(
                        "Error trying to save workspaceFrozenColumnID",
                        { error: err, fields: field.columnName }
                     );
                  });
               break;
            case "edit":
               // pass control on to our Popup:
               this.PopupNewDataFieldComponent.show(field);
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
                        field
                           .destroy()
                           .then(() => {
                              Datatable.refreshHeader();
                              _logic.loadData();

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

                              var application = this.AB.applicationByID(
                                 this.CurrentApplicationID
                              );
                              checkPages(application.pages(), (err) => {});
                           })
                           .catch((err) => {
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
      callbackSortFields(sort_settings) {
         this.CurrentObject.workspaceSortFields = sort_settings;
         this.CurrentObject.save().then(() => {
            _logic.getBadgeSortFields();
            Datatable.refreshHeader();
            _logic.loadData();
         });
      }

      /**
       * @function callbackViewAdded
       *
       * call back for when a new workspace view is added
       */
      callbackViewAdded(view) {
         this.switchWorkspaceView(view);
         Datatable.refreshHeader();
         this.loadData();
      }

      /**
       * @function callbackViewUpdated
       *
       * call back for when a workspace view is updated
       */
      callbackViewUpdated(view) {
         if (view.id === this.workspaceViews.getCurrentView().id) {
            this.switchWorkspaceView(view);
         } else {
            this.refreshWorkspaceViewMenu();
         }
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
         $$(ids.buttonDeleteSelected).show();
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
         $$(ids.buttonDeleteSelected).hide();
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

         if (frozenID !== "" && typeof frozenID != "undefined") {
            var badgeNumber = Datatable.getColumnIndex(frozenID) + 1;

            $$(ids.buttonFrozen).define("badge", badgeNumber || null);
            $$(ids.buttonFrozen).refresh();
         }
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
         var sortFields = this.workspaceViews.sortFields;

         if (typeof sortFields != "undefined") {
            $$(ids.buttonSort).define("badge", sortFields.length || null);
            $$(ids.buttonSort).refresh();
         }
      }

      /**
       * @function rowAdd()
       *
       * When our [add row] button is pressed, alert our DataTable
       * component to add a row.
       */
      async rowAdd() {
         // safety check
         if (!this.settings.isEditable) return;

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
         $$(ids.component).show();
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
         PopupImportObjectComponent.show();
      }

      toolbarButtonExport($view) {
         PopupExportObjectComponent.show($view);
      }

      toolbarDeleteSelected($view) {
         var deleteTasks = [];
         $$(Datatable.ui.id).data.each(function (obj) {
            if (
               typeof obj != "undefined" &&
               obj.hasOwnProperty("appbuilder_select_item") &&
               obj.appbuilder_select_item == 1
            ) {
               deleteTasks.push(function (next) {
                  this.CurrentObject.model()
                     .delete(obj.id)
                     .then((response) => {
                        if (response.numRows > 0) {
                           $$(Datatable.ui.id).remove(obj.id);
                        }
                        next();
                     }, next);
               });
            }
         });

         if (deleteTasks.length > 0) {
            OP.Dialog.Confirm({
               title: L("ab.massDelete.title", "*Delete Multiple Records"),
               text: L(
                  "ab.massDelete.description",
                  "*Are you sure you want to delete the selected records?"
               ),
               callback: function (result) {
                  if (result) {
                     async.parallel(deleteTasks, function (err) {
                        if (err) {
                           // TODO : Error message
                        } else {
                           // Anything we need to do after we are done.
                           _logic.disableUpdateDelete();
                        }
                     });
                  }
               },
            });
         } else {
            OP.Dialog.Alert({
               title: "No Records Selected",
               text: "You need to select at least one record...did you drink your coffee today?",
            });
         }
      }

      /**
       * @function toolbarDefineLabel
       *
       * Show the popup to allow the user to define the default label for
       * this object.
       */
      toolbarDefineLabel($view) {
         PopupDefineLabelComponent.show($view);
      }

      /**
       * @function toolbarFieldsVisible
       *
       * Show the popup to allow the user to hide columns for this view.
       */
      toolbarFieldsVisible($view) {
         PopupHideFieldComponent.show($view);
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
         PopupFrozenColumnsComponent.show($view);
      }

      toolbarPermission($view) {
         console.error("TODO: toolbarPermission()");
      }

      toolbarMassUpdate($view) {
         PopupMassUpdateComponent.show($view);
      }

      /**
       * @function toolbarSort
       *
       * show the popup to sort the datatable
       */
      toolbarSort($view, fieldId) {
         PopupSortFieldComponent.show($view, fieldId);
         // self.refreshPopupData();
         // $$(self.webixUiId.sortFieldsPopup).show($view);
         //console.error('TODO: toolbarSort()');
      }

      /**
       * @function populateObjectWorkspace()
       *
       * Initialize the Object Workspace with the provided ABObject.
       *
       * @param {ABObject} object  	current ABObject instance we are working with.
       */
      populateObjectWorkspace(objectID) {
         $$(this.ids.toolbar).show();
         $$(this.ids.selectedObject).show();

         this.CurrentObjectID = objectID;

         // get current view from object
         this.workspaceViews.objectLoad(objectID);
         var currentView = this.workspaceViews.getCurrentView();
         // {WorkspaceView}
         // The current workspace view that is being displayed in our work area
         // currentView.component {ABViewGrid | ABViewKanBan | ABViewGantt}

         // // get defined views
         // // update the view picker in the toolbar

         // // get toolbar config
         // // update toolbar with approved tools

         // /// still working with DataTable
         // // initial data
         // _logic.loadData();

         // // the replicated tables are read only
         // if (this.CurrentObject.isReadOnly) {
         //    DataTable.readonly();

         //    if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).disable();
         // } else {
         //    DataTable.editable();

         //    if ($$(ids.buttonRowNew)) $$(ids.buttonRowNew).enable();
         // }

         var object = this.AB.objectByID(objectID);
         this.CurrentDatacollection.datasource = object;

         Datatable.objectLoad(objectID);
         // KanBan.objectLoad(objectID);
         // Gantt.objectLoad(objectID);

         this.PopupNewDataFieldComponent.objectLoad(objectID);
         // PopupDefineLabelComponent.objectLoad(object);
         // PopupFilterDataTableComponent.objectLoad(object);
         // PopupFrozenColumnsComponent.objectLoad(object);
         // PopupFrozenColumnsComponent.setValue(
         //    object.workspaceFrozenColumnID || ""
         // );
         // PopupFrozenColumnsComponent.setHiddenFields(
         //    object.workspaceHiddenFields
         // );
         // PopupHideFieldComponent.objectLoad(object);
         // PopupHideFieldComponent.setValue(object.workspaceHiddenFields);
         // PopupHideFieldComponent.setFrozenColumnID(
         //    object.workspaceFrozenColumnID || ""
         // );
         // PopupMassUpdateComponent.objectLoad(object, DataTable);
         // PopupSortFieldComponent.objectLoad(object);
         // PopupSortFieldComponent.setValue(object.workspaceSortFields);
         // PopupImportObjectComponent.objectLoad(object);
         // PopupExportObjectComponent.objectLoad(object);
         // PopupExportObjectComponent.objectLoad(object);
         // PopupExportObjectComponent.setGridComponent($$(DataTable.ui.id));
         // PopupExportObjectComponent.setHiddenFields(
         //    object.workspaceHiddenFields
         // );
         // PopupExportObjectComponent.setFilename(object.label);
         this.PopupViewSettingsComponent.objectLoad(objectID);

         // Datatable.refreshHeader();
         // _logic.refreshToolBarView();

         // _logic.refreshIndexes();

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

         this.switchWorkspaceView(currentView);
         this.refreshWorkspaceViewMenu();

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

      get CurrentObject() {
         return this.AB.objectByID(this.CurrentObjectID);
      }

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

      switchWorkspaceView(view) {
         if (this.hashViews[view.type]) {
            this.workspaceViews.setCurrentView(view.id);
            this.hashViews[view.type].show(view);
            this.refreshWorkspaceViewMenu();

            // now update the rest of the toolbar for this view:
            this.refreshToolBarView();

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

         // get badge counts for server side components
         this.getBadgeHiddenFields();
         this.getBadgeFrozenColumn();
         this.getBadgeSortFields();
         this.getBadgeFilters();

         // $$(ids.component).setValue(ids.selectedObject);
         $$(ids.selectedObject).show(true, false);

         var object = this.AB.objectByID();
         // disable add fields into the object
         if (
            this.CurrentObject.isExternal ||
            this.CurrentObject.isImported ||
            !this.settings.isFieldAddable
         ) {
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
         webix.ui([], $$(ids.listIndex));

         indexes.forEach((index) => {
            this.addNewIndex(index);
         });
      }

      addNewIndex(index) {
         $$(this.ids.listIndex).addView({
            view: view,
            label: index.name,
            icon: "fa fa-key",
            css: "webix_transparent",
            type: "icon",
            width: 160,
            click: () => {
               CustomIndex.open(this.CurrentObject, index);
            },
         });
      }
   }

   return new UIWorkObjectWorkspace(init_settings);
}
