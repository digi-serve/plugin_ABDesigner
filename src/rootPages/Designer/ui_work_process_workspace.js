import UI_Class from "./ui_class";

import UI_Work_Process_Workspace_MODEL from "./ui_work_process_workspace_model";
import UI_Work_Process_Workspace_MONITOR from "./ui_work_process_workspace_monitor";

export default function (AB) {
   const ibase = "ui_work_process_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   var L = UIClass.L();

   let mockUI = {
      ui: () => {},
      init: () => {
         return Promise.resolve();
      },
      applicationLoad: () => {},
      clearWorkspace: () => {},
      processLoad: () => {},
   };
   const ModelUI = UI_Work_Process_Workspace_MODEL(AB);
   const TestUI = mockUI;
   const MonitorUI = UI_Work_Process_Workspace_MONITOR(AB);

   class UI_Work_Process_Workspace extends UIClass {
      constructor() {
         super(ibase, {
            multiview: "",

            tabbar: "",
            tabModel: "",
            tabTest: "",
            tabMonitor: "",

            noSelection: "",
            selectedItem: "",
         });
      }

      ui() {
         let ids = this.ids;

         return {
            view: "multiview",
            id: ids.component,
            keepViews: true,
            rows: [
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
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-code-fork'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select a process to work with."),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              label: L("Add new process"),
                              type: "form",
                              css: "webix_primary",
                              autowidth: true,
                              click: () => {
                                 this.addNewProcess();
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
                  id: ids.selectedItem,
                  type: "wide",
                  paddingY: 0,
                  // css: "ab-data-toolbar",
                  // borderless: true,
                  rows: [
                     {
                        id: ids.tabbar,
                        view: "tabbar",
                        css: "webix_dark",
                        type: "bottom",
                        borderless: false,
                        bottomOffset: 0,
                        // css: "ab-data-toolbar",
                        options: [
                           {
                              id: ids.tabModel,
                              value: L("Model"),
                              icon: "fa fa-code-fork",
                              type: "icon",
                              on: {
                                 click: () => {
                                    this.changeTab("model");
                                 },
                              },
                           },
                           {
                              id: ids.tabTest,
                              value: L("Test"),
                              icon: "fa fa-check-square",
                              type: "icon",
                              on: {
                                 click: () => {
                                    this.changeTab("test");
                                 },
                              },
                           },
                           {
                              id: ids.tabMonitor,
                              value: L("Monitor"),
                              icon: "fa fa-tachometer",
                              type: "icon",
                              on: {
                                 click: () => {
                                    this.changeTab("monitor");
                                 },
                              },
                           },
                        ],
                        on: {
                           onChange: (newv, oldv) => {
                              if (newv != oldv) {
                                 this.changeTab(newv);
                              }
                           },
                        },
                     },
                     {
                        id: ids.multiview,
                        view: "multiview",
                        cells: [
                           ModelUI.ui(),
                           // TestUI.ui(),
                           MonitorUI.ui(),
                        ],
                     },
                  ],
               },
            ],
         };
      }

      async init(AB) {
         this.AB = AB;

         this.warningsPropogate([ModelUI, /* TestUI, */ MonitorUI]);

         $$(this.ids.noSelection).show();
         var allInits = [ModelUI.init(AB), TestUI.init(AB), MonitorUI.init(AB)];

         await Promise.all(allInits);
      }

      addNewProcess() {
         this.emit("addNew");
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Object Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         ModelUI.applicationLoad(application);
         TestUI.applicationLoad(application);
         MonitorUI.applicationLoad(application);
      }

      /**
       * @function changeTab
       *
       * receive the command for which tab to display.
       * @param {string} mode  the name/key of which tab to display.
       */
      changeTab(tab) {
         let ids = this.ids;

         switch (tab) {
            case ids.tabModel:
               $$(ids.multiview).setValue(ModelUI.ids.component);
               break;

            case ids.tabTest:
               $$(ids.multiview).setValue(TestUI.ids.component);
               break;

            case ids.tabMonitor:
               $$(ids.multiview).setValue(MonitorUI.ids.component);
               break;
         }
      }

      /**
       * @function clearWorkspace()
       *
       * Clear the object workspace.
       */
      clearWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection).show(false, false);

         ModelUI.clearWorkspace();
         TestUI.clearWorkspace();
         MonitorUI.clearWorkspace();
      }

      /**
       * @function processLoad()
       * Initialize the Workspace with the provided ABProcess.
       * @param {ABProcess} process
       *        current ABProcess instance we are working with.
       */
      processLoad(process) {
         super.processLoad(process);

         $$(this.ids.selectedItem).show();

         ModelUI.processLoad(this.CurrentProcess);
         TestUI.processLoad(this.CurrentProcess);
         MonitorUI.processLoad(this.CurrentProcess);
      }
   }

   return new UI_Work_Process_Workspace();
}
