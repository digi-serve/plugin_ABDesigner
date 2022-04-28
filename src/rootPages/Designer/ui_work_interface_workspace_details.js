/*
 * ui_work_interface_workspace_details
 *
 * Manages the Editor details column: Components & Properties
 *
 */

import UI_Class from "./ui_class";
// import UI_Warnings from "./ui_warnings";

import ABWorkspaceProperties from "./ui_work_interface_workspace_details_properties";

export default function (AB) {
   const ibase = "ui_work_interface_workspace_details";
   // const uiConfig = AB.Config.uiSettings();
   const UIClass = UI_Class(AB);
   // const L = UIClass.L();

   var PropertiesList = ABWorkspaceProperties(AB);

   class UI_Work_Interface_Workspace_Details extends UIClass {
      constructor() {
         super(ibase);
      }

      // webix UI definition:
      ui() {
         return {
            id: this.ids.component,
            width: 350,
            // scroll: true,
            rows: [PropertiesList.ui()],
         };
      }

      // setting up UI
      init(AB) {
         this.AB = AB;

         PropertiesList.on("view.changed", () => {
            this.emit("view.changed");
         });
         return PropertiesList.init(AB);
      }

      /**
       * @function applicationLoad
       * Initialize this Workspace with the given ABApplication.
       * @param {ABApplication} application
       */
      applicationLoad(application) {
         super.applicationLoad(application);

         PropertiesList.applicationLoad(application);
      }

      /**
       * @function show()
       *
       * Show this component.
       */
      show() {
         $$(this.ids.component).show();
      }

      /*
       * @method viewLoad
       * A new View has been selected for editing, so update
       * our interface with the details for this View.
       * @param {ABView} view  current view instance.
       */
      viewLoad(view) {
         super.viewLoad(view);
         PropertiesList.viewLoad(view);
      }
   }

   return new UI_Work_Interface_Workspace_Details();
}
