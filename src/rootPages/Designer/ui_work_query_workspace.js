import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

import FWorkspaceDesign from "./ui_work_query_workspace_design";
import FWorkspaceDisplay from "./ui_work_object_workspace";

export default function (AB, init_settings) {
   const UIClass = UI_Class(AB);
   const uiConfig = AB.Config.uiSettings();
   var L = UIClass.L();

   const iBase = "ui_work_query_workspace";
   const QueryDesignComponent = FWorkspaceDesign(AB);
   const QueryDisplayComponent = FWorkspaceDisplay(AB, `${iBase}_display`, {
      isReadOnly: true,
   });

   var Warnings = UI_Warnings(AB, `${iBase}_view_warnings`, init_settings);

   class UI_Work_Query_Workspace extends UIClass {
      constructor(settings = {}) {
         super(iBase, {
            multiview: "",
            toolbar: "",
            modeButton: "",
            // loadAllButton: "",
            noSelection: "",
            run: "",
            design: "",
         });

         this.settings = settings;
      }

      ui() {
         var ids = this.ids;

         return {
            view: "multiview",
            cells: [
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
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-filter'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select a query to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              css: "webix_primary",
                              label: L("Add new query"),
                              type: "form",
                              autowidth: true,
                              click: () => {
                                 this.emit("query.add");
                                 // App.actions.addNewQuery(true);
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
                  // type: "line",
                  id: ids.component,
                  rows: [
                     {
                        id: ids.toolbar,
                        view: "tabbar",
                        // hidden: true,
                        css: "webix_dark",
                        type: "bottom",
                        borderless: false,
                        bottomOffset: 0,
                        // css: "ab-data-toolbar",
                        options: [
                           {
                              id: ids.design,
                              value: L("Build Query"),
                              icon: "fa fa-sliders",
                              type: "icon",
                              // on: {
                              //    click: () => {
                              //       this.changeMode("run");
                              //    },
                              // },
                           },
                           {
                              id: ids.run,
                              value: L("View Query"),
                              icon: "fa fa-table",
                              type: "icon",
                              // on: {
                              //    click: () => {
                              //       this.changeMode("design");
                              //    },
                              // },
                           },
                        ],
                        on: {
                           onChange: (newv, oldv) => {
                              if (newv != oldv) {
                                 this.changeMode(newv);
                              }
                           },
                        },
                     },
                     { height: 10 },
                     {
                        id: ids.multiview,
                        view: "multiview",
                        cells: [
                           QueryDesignComponent.ui(),
                           QueryDisplayComponent.ui(),
                        ],
                     },
                     Warnings.ui(),
                     // {
                     //    id: ids.loadAllButton,
                     //    view: "button",
                     //    css: "webix_primary",
                     //    label: L("Load all"),
                     //    type: "form",
                     //    hidden: true,
                     //    click: () => {
                     //       this.loadAll();
                     //    },
                     // },
                  ],
               },
            ],
         };
      }

      init(AB) {
         this.AB = AB;

         this.warningsPropogate([QueryDesignComponent, QueryDisplayComponent]);
         this.on("warnings", () => {
            Warnings.show(this.CurrentQuery);
         });

         return Promise.all([
            QueryDesignComponent.init(AB),
            QueryDisplayComponent.init(AB),
         ]);
      }

      // applicationLoad(app) {
      //    super.applicationLoad(app);
      //    // TODO
      // }

      changeMode(mode) {
         let ids = this.ids;

         // $$(ids.noSelection).hide(false, false);
         $$(this.ids.component).show();
         $$(ids.toolbar).show(false, false);

         // Run
         if (mode == ids.run) {
            // $$(ids.modeButton).define('label', labels.design);
            // $$(ids.modeButton).define('icon', "fa fa-tasks");
            // $$(ids.loadAllButton).show();
            // $$(ids.loadAllButton).refresh();

            QueryDisplayComponent.show();
            QueryDisplayComponent.populateObjectWorkspace(this.CurrentQueryID);

            // $$(ids.multiview).setValue(DataTable.ui.id);
         }
         // Design
         else {
            // $$(ids.modeButton).define('label', labels.run);
            // $$(ids.modeButton).define('icon', "fa fa-filter");
            // $$(ids.loadAllButton).hide();
            // $$(ids.loadAllButton).refresh();

            QueryDesignComponent.show(true);
            QueryDesignComponent.queryLoad(this.CurrentQuery);
         }

         // $$(ids.modeButton).refresh();
      }

      applicationLoad(application) {
         super.applicationLoad(application);

         this.clearWorkspace();
         QueryDesignComponent.applicationLoad(application);
         QueryDisplayComponent.applicationLoad(application);
      }

      clearWorkspace() {
         $$(this.ids.noSelection).show(false, false);
         QueryDesignComponent.clearWorkspace();
      }

      loadAll() {
         QueryDisplayComponent.loadAll();
      }

      queryLoad(query) {
         super.queryLoad(query);

         Warnings.show(query);

         QueryDesignComponent.queryLoad(query);
         QueryDisplayComponent.queryLoad(query);

         if (!query) {
            this.clearWorkspace();
         } else {
            $$(this.ids.component).show();
            QueryDesignComponent.show(true);
         }
      }

      /**
       * @function resetTabs()
       * Set the tabs to the default state when a new query is selected.
       */
      resetTabs() {
         $$(this.ids.toolbar)?.setValue?.(this.ids.design);
      }
   }

   return new UI_Work_Query_Workspace(init_settings);
}
