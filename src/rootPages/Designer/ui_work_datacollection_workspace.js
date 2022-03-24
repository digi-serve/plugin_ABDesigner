import UI_Class from "./ui_class";
import FWorkspaceViews from "./ui_work_datacollection_workspace_workspaceviews";
import FWorkspaceDisplay from "./ui_work_object_workspace_view_grid";
import FWorkspaceProperty from "./ui_work_datacollection_workspace_properties";

export default function (AB, init_settings) {
   const ibase = "ui_work_datacollection_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const Datatable = FWorkspaceDisplay(AB, `${ibase}_view_grid`, init_settings);
   const Property = FWorkspaceProperty(AB);

   class UI_Work_Datacollection_Workspace extends UIClass {
      constructor(base, settings = {}) {
         super(base, {
            multiview: "",
            noSelection: "",
            workspace: "",
         });
         this.AB = AB;

         this.settings = settings;

         this.workspaceViews = FWorkspaceViews(AB, `${base}_views`, settings);
         this.hashViewsGrid = Datatable;
      }

      ui() {
         const ids = this.ids;

         return {
            view: "multiview",
            id: ids.multiview,
            cells: [
               // No selection
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
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-table'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select a datacollection to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              css: "webix_primary",
                              label: L("Add new data view"),
                              type: "form",
                              autowidth: true,
                              click: function () {
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

               // Workspace
               {
                  id: ids.workspace,
                  view: "layout",
                  cols: [
                     // Workspace
                     Datatable.ui(),

                     { view: "resizer", css: "bg_gray", width: 11 },

                     // Property
                     Property.ui(),
                  ],
               },
            ],
         };
      }

      async init(AB) {
         const ids = this.ids;

         this.AB = AB;

         this.workspaceViews.init(AB);

         await Datatable.init(AB);
         Property.init(AB);

         this.CurrentDatacollection = this.AB.datacollectionNew({});
         this.CurrentDatacollection.init();

         Datatable.datacollectionLoad(this.CurrentDatacollection);

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         Datatable.applicationLoad(application);
         Property.applicationLoad(application);
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
         // if (this.workspaceViews?.filterConditions?.rules?.length > 0) {
         //    wheres = this.workspaceViews.filterConditions;
         // }

         var sorts = [];
         if (this.workspaceViews?.sortFields?.length > 0) {
            sorts = this.workspaceViews?.sortFields;
         }

         this.CurrentDatacollection.fromValues({
            settings: {
               objectWorkspace: {
                  filterConditions: wheres,
                  sortFields: sorts,
               },
            },
         });

         this.CurrentDatacollection.refreshFilterConditions(wheres);
         this.CurrentDatacollection.clearAll();

         // WORKAROUND: load all data becuase kanban does not support pagination now
         this.CurrentDatacollection.loadData(0, 30).catch((err) => {
            let message = err.toString();
            if (typeof err == "string") {
               try {
                  var jErr = JSON.parse(err);
                  if (jErr.data && jErr.data.sqlMessage) {
                     message = jErr.data.sqlMessage;
                  }
               } catch (e) {
                  // Do nothing
               }
            }

            const ids = this.ids;
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
               context: "ui_work_datacollection_workspace.loadData()",
               message,
               datacollection: this.CurrentDatacollection.toObj(),
            });
         });
      }

      clearWorkspace() {
         const ids = this.ids;

         $$(ids.noSelection).show(false, false);
      }

      async populateWorkspace(datacollection) {
         const ids = this.ids;

         this.CurrentDatacollection = datacollection;

         // get current view from object
         this.workspaceViews.datacollectionLoad(datacollection);
         const currentView = this.workspaceViews.getCurrentView();
         // {WorkspaceView}
         // The current workspace view that is being displayed in our work area
         // currentView.component {ABViewGrid}

         Datatable.datacollectionLoad(datacollection);
         Property.datacollectionLoad(datacollection);

         if (this.hashViewsGrid) {
            this.workspaceViews.setCurrentView(currentView.id);
            await this.hashViewsGrid.show(currentView);
         }

         // save current view
         this.workspaceViews.save();

         this.loadData();

         $$(ids.workspace).show();
      }
   }

   return new UI_Work_Datacollection_Workspace(ibase, init_settings);
}
