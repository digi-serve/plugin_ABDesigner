/*
 * ui_work_interface_workspace
 *
 * Display the form for creating a new UI Page for the application.
 *
 */

import UI_Class from "./ui_class";
import UI_Warnings from "./ui_warnings";

import ABWorkspaceEditor from "./ui_work_interface_workspace_editor";
import ABWorkspaceDetails from "./ui_work_interface_workspace_details";

export default function (AB) {
   const ibase = "ui_work_interface_workspace";
   const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   const L = UIClass.L();

   const Warnings = UI_Warnings(AB, `${ibase}_view_warnings`, {});

   class UI_Work_Interface_Workspace extends UIClass {
      constructor() {
         super(ibase, {
            noSelection: "",
            selectedView: "",
         });

         this.ColumnEditor = ABWorkspaceEditor(AB);
         this.ColumnDetails = ABWorkspaceDetails(AB);

         this.classABViewPage = AB.Class.ABViewManager.viewClass("page");
      }

      // webix UI definition:
      ui() {
         let ids = this.ids;

         return {
            view: "multiview",
            id: ids.component,
            scroll: true,
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
                        label: "<div style='display: block; font-size: 180px; background-color: #666; color: transparent; text-shadow: 0px 1px 1px rgba(255,255,255,0.5); -webkit-background-clip: text; -moz-background-clip: text; background-clip: text;' class='fa fa-file-text-o'></div>",
                     },
                     {
                        view: "label",
                        align: "center",
                        label: L("Select a page to edit"),
                     },
                     {
                        cols: [
                           {},
                           {
                              view: "button",
                              css: "webix_primary",
                              label: L("Add a new page"),
                              type: "form",
                              autowidth: true,
                              click: () => {
                                 this.emit("view.new");
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
                  id: ids.selectedView,
                  view: "layout",
                  rows: [
                     {
                        cols: [
                           this.ColumnEditor.ui(),
                           { view: "resizer", css: "bg_gray", width: 11 },
                           this.ColumnDetails.ui(),
                        ],
                     },
                     Warnings.ui(),
                  ],
               },
            ],
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;

         // webix.extend($$(ids.form), webix.ProgressBar);
         $$(this.ids.noSelection).show();
         $$(this.ids.selectedView).hide();

         var allInits = [];
         allInits.push(this.ColumnEditor.init(AB));
         allInits.push(this.ColumnDetails.init(AB));

         this.ColumnEditor.on("view.load", (view) => {
            this.viewLoad(view);
         });

         this.ColumnDetails.on("view.changed", () => {
            // a property of a view has changed, so reload
            // the current display of the View.
            this.ColumnEditor.viewLoad(this.CurrentView);
         });

         this.warningsPropogate([this.ColumnEditor, this.ColumnDetails]);
         // NOTE: this is already handled down in the ColumnEditor:
         this.on("warnings", () => {
            // make sure our view refreshes it's display
            this.viewLoad(this.CurrentView);
         });

         return Promise.all(allInits);
      }

      /**
       * @function applicationLoad
       *
       * Initialize the Interface Workspace with the given ABApplication.
       *
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         //  InterfaceWorkspace.clearInterfaceWorkspace();
         this.ColumnEditor.applicationLoad(application);
         this.ColumnDetails.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component)?.show();
      }

      /**
       * @function clearWorkspace()
       *
       * Clear the interface workspace.
       */
      clearWorkspace() {
         // NOTE: to clear a visual glitch when multiple views are updating
         // at one time ... stop the animation on this one:
         $$(this.ids.noSelection)?.show(false, false);
      }

      /**
       * @function viewLoad()
       * Initialize the Interface Workspace with the provided ABView.
       * @param {ABView} view
       *        current ABView instance we are working with.
       */
      viewLoad(view) {
         super.viewLoad(view);

         // $$(ids.noSelection).hide();
         $$(this.ids.selectedView)?.show();

         this.ColumnEditor.viewLoad(view);
         this.ColumnDetails.viewLoad(view);

         $$(this.ids.component)?.resize();

         // select a page in interface list
         if (view instanceof this.classABViewPage) {
            this.emit("select.view", view);
         }

         Warnings.show(view);
      }
   }

   return new UI_Work_Interface_Workspace();
}
