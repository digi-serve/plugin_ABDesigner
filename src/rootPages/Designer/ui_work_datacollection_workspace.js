import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

import FWorkspaceViews from "./ui_work_object_workspace_workspaceviews";
import FWorkspaceDisplay from "./ui_work_object_workspace_view_grid";
import FWorkspaceProperty from "./ui_work_datacollection_workspace_properties";
import FWorkspaceLinkedDC from "./ui_work_datacollection_workspace_linked_dc";

export default function (AB, init_settings) {
   const ibase = "ui_work_datacollection_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const Datatable = FWorkspaceDisplay(AB, `${ibase}_view_grid`, init_settings);
   const Property = FWorkspaceProperty(AB);
   const LinkedDC = FWorkspaceLinkedDC(AB);

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`, init_settings);

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
                              label: L("Add new data collection"),
                              type: "form",
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
                  id: ids.workspace,
                  view: "layout",
                  rows: [
                     {
                        cols: [
                           // Workspace
                           {
                              view: "layout",
                              rows: [
                                 LinkedDC.ui(),
                                 Datatable.ui(),
                              ]
                           },

                           { view: "resizer", css: "bg_gray", width: 11 },

                           // Property
                           Property.ui(),
                        ],
                     },
                     Warnings.ui(),
                  ],
               },
            ],
         };
      }

      async init(AB) {
         const ids = this.ids;

         this.AB = AB;

         this.warningsPropogate([Property, Datatable]);
         this.on("warnings", () => {
            Warnings.show(this.mockDatacollection);
         });

         this.workspaceViews.init(AB);

         Property.on("save", async (datacollection) => {
            this.datacollectionLoad(datacollection);

            // refresh grid view
            if (this.hashViewsGrid) {
               await this.hashViewsGrid.show(Datatable.defaultSettings());
            }

            await this.populateWorkspace(datacollection);
         });

         await Datatable.init(AB);
         await Property.init(AB);
         await LinkedDC.init(AB);

         this.mockDatacollection = this.AB.datacollectionNew({});
         this.mockDatacollection.init();

         Datatable.datacollectionLoad(this.mockDatacollection);
         Property.datacollectionLoad(this.mockDatacollection);
         LinkedDC.datacollectionLoad(this.mockDatacollection);

         $$(ids.noSelection).show();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         Datatable.applicationLoad(application);
         Property.applicationLoad(application);
         LinkedDC.applicationLoad(application);
      }

      datacollectionLoad(datacollection) {
         super.datacollectionLoad(datacollection);

         Warnings.show(datacollection);

         Datatable.datacollectionLoad(datacollection);
         Property.datacollectionLoad(datacollection);
         LinkedDC.datacollectionLoad(datacollection);

         if (!datacollection) {
            this.clearWorkspace();
         }
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
         this.mockDatacollection.clearAll();
         // WORKAROUND: load all data becuase kanban does not support pagination now
         try {
            this.mockDatacollection.loadData(0, 20);
         } catch (err) {
            let message = err.toString();
            if (typeof err == "string") {
               try {
                  const jErr = JSON.parse(err);
                  if (jErr.data && jErr.data.sqlMessage) {
                     message = jErr.data.sqlMessage;
                  }
               } catch (e) {
                  // Do nothing
               }
            }

            this.AB.notify.developer(err, {
               context: "ui_work_datacollection_workspace.loadData()",
               message,
               datacollection: this.mockDatacollection.toObj(),
            });
         }
      }

      clearWorkspace() {
         const ids = this.ids;

         $$(ids.noSelection).show(false, false);
      }

      async populateWorkspace(datacollection) {
         const ids = this.ids;

         $$(ids.workspace).show();

         this.mockDatacollection = datacollection;

         this.workspaceViews.objectLoad(null);

         // clear object caching in workspace
         if (this.mockDatacollection?.datasource?.id)
            this.workspaceViews.clearObjectCache(
               this.mockDatacollection.datasource.id
            );

         // get current view from object
         this.workspaceViews.objectLoad(this.mockDatacollection.datasource);
         const currentView = this.workspaceViews.getCurrentView();

         // {WorkspaceView}
         // The current workspace view that is being displayed in our work area
         // currentView.component {ABViewGrid}
         if (this.hashViewsGrid) {
            this.workspaceViews.setCurrentView(currentView.id);

            await this.hashViewsGrid.show(currentView);
         }

         // save current view
         await this.workspaceViews.save();

         this.loadData();

         this.warningsRefresh(datacollection);
      }
   }

   return new UI_Work_Datacollection_Workspace(ibase, init_settings);
}
